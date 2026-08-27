import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.THREESIXTY_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 400 });
    }

    // ✅ CORRECT endpoint: .net not .com
    const url = `https://api.360messenger.net/sendMessage?apikey=${apiKey}&phonenumber=2348146259160&text=✅ API test from AI SalesOS – 360Messenger works!&isGroup=false`;

    console.log('📤 Sending to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send');
    }

    return NextResponse.json({ 
      success: true, 
      message: '✅ Message sent! Check your WhatsApp.',
      data 
    });

  } catch (error: any) {
    console.error('❌ 360Messenger error:', error);
    return NextResponse.json({ 
      error: error.message,
      hint: 'Check your API key and internet connection.'
    }, { status: 500 });
  }
}