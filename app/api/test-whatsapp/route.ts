import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !from) {
      return NextResponse.json({ error: 'Twilio credentials missing' }, { status: 400 });
    }

    const to = '+2348146259160'; // Your WhatsApp number
    const message = '🎉 TEST MESSAGE: Your AI SalesOS is working! This is a test from the AI Sales Agent.';

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const formData = new URLSearchParams();
    formData.append('To', `whatsapp:${to}`);
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

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Twilio error');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'WhatsApp message sent! Check your phone.',
      twilio_response: result
    });

  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}