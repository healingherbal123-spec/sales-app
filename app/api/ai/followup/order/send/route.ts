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
    throw new Error('Twilio credentials missing');
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

export async function POST(req: Request) {
  try {
    const { orderId, message } = await req.json();
    if (!orderId || !message) {
      return NextResponse.json({ error: 'orderId and message required' }, { status: 400 });
    }

    // Fetch order to get phone number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('customer_phone, id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.customer_phone) {
      return NextResponse.json({ error: 'Customer phone missing' }, { status: 400 });
    }

    // Send WhatsApp
    const twilioResult = await sendWhatsAppMessage(order.customer_phone, message);

    // Update order with follow-up timestamp
    await supabase
      .from('orders')
      .update({ sales_ai_followed_up_at: new Date().toISOString() })
      .eq('id', orderId);

    return NextResponse.json({ success: true, sid: twilioResult.sid });
  } catch (error: any) {
    console.error('Send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}