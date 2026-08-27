import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function sendWhatsAppMessage(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    throw new Error('Twilio credentials missing in .env.local');
  }

  let formattedTo = to.trim();
  if (!formattedTo.startsWith('+')) {
    if (formattedTo.startsWith('0')) {
      formattedTo = '+234' + formattedTo.slice(1);
    } else {
      formattedTo = '+234' + formattedTo;
    }
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const formData = new URLSearchParams();
  formData.append('To', `whatsapp:${formattedTo}`);
  formData.append('From', `whatsapp:${from}`);
  formData.append('Body', message);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

export async function GET() {
  const results: any[] = [];

  try {
    console.log('🔍 Sales AI Trigger started...');

    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('name', 'Sales AI')
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Sales AI agent not found' }, { status: 404 });
    }

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .eq('payment_status', 'pending')
      .lt('created_at', twoHoursAgo)
      .is('sales_ai_followed_up_at', null)
      .order('created_at', { ascending: true })
      .limit(50);

    if (ordersError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No pending orders to follow up.' });
    }

    console.log(`📦 Found ${orders.length} orders to follow up.`);

    for (const order of orders) {
      const orderResult: any = {
        order_id: order.id,
        order_number: order.order_number,
        customer: order.customer_name,
        phone: order.customer_phone,
      };

      try {
        const prompt = `Order #${order.order_number || order.id.slice(0, 8)} for ${order.customer_name}
Amount: ₦${order.total?.toLocaleString() || '0'}
Amount due: ₦${order.amount_due?.toLocaleString() || '0'}
Created: ${new Date(order.created_at).toLocaleString()}

Generate a polite WhatsApp follow-up message for this customer who hasn't completed payment.
Offer to switch to Pay on Delivery if that helps.
Keep it professional and friendly.`;

        const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: agent.id,
            userMessage: prompt,
            systemInstructions: agent.system_instructions ||
              'You are Sales AI. Recover abandoned orders with polite WhatsApp follow-ups. Offer Pay on Delivery.',
            model: agent.model_name || 'deepseek-chat',
            temperature: agent.temperature || 0.7,
            maxTokens: agent.max_tokens || 500,
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          throw new Error(`AI route error: ${errText}`);
        }

        const aiData = await aiResponse.json();
        const followUpMessage = aiData.reply || 'Your order is pending – please complete payment.';

        orderResult.message_preview = followUpMessage.slice(0, 200) + '...';

        if (order.customer_phone) {
          try {
            const twilioResult = await sendWhatsAppMessage(order.customer_phone, followUpMessage);
            orderResult.whatsapp_sent = true;
            orderResult.twilio_sid = twilioResult.sid;
            console.log(`📨 WhatsApp sent to ${order.customer_phone}`);
          } catch (twilioError: any) {
            orderResult.whatsapp_sent = false;
            orderResult.whatsapp_error = twilioError.message;
          }
        } else {
          orderResult.whatsapp_sent = false;
          orderResult.whatsapp_error = 'No phone number';
        }

        await supabase
          .from('orders')
          .update({ sales_ai_followed_up_at: new Date().toISOString() })
          .eq('id', order.id);

        orderResult.status = 'success';
        results.push(orderResult);

      } catch (orderError: any) {
        orderResult.status = 'error';
        orderResult.error = orderError.message;
        results.push(orderResult);
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} orders.`,
      results,
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Trigger failed: ' + error.message }, { status: 500 });
  }
}