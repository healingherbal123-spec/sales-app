import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const webhookUrl = 'https://kwhsyojmcbitvjhvihlq.supabase.co/functions/v1/whatsapp-test/send';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '2348146259160',
        message: '✅ Test from custom webhook! This is working!',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send');
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}