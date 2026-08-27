import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    // 1. Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Fetch the Sales AI agent
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('name', 'Sales AI')
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Sales AI agent not found' }, { status: 404 });
    }

    // 3. Build the prompt
    const prompt = `Order #${order.order_number || order.id.slice(0, 8)} for ${order.customer_name}
Amount: ₦${order.total?.toLocaleString() || '0'}
Amount due: ₦${order.amount_due?.toLocaleString() || '0'}
Created: ${new Date(order.created_at).toLocaleString()}

Generate a polite WhatsApp follow-up message for this customer who hasn't completed payment.
Offer to switch to Pay on Delivery if that helps.
Keep it professional and friendly.`;

    // 4. Call DeepSeek
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

    const aiData = await aiResponse.json();
    if (!aiResponse.ok) {
      throw new Error(aiData.error || 'AI failed');
    }
    const message = aiData.reply;

    // 5. Check if already followed up
    const { data: existing } = await supabase
      .from('orders')
      .select('sales_ai_followed_up_at')
      .eq('id', orderId)
      .single();

    const wasSent = !!existing?.sales_ai_followed_up_at;

    return NextResponse.json({ message, wasSent });
  } catch (error: any) {
    console.error('AI follow-up error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}