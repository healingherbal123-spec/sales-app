import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Init DeepSeek
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, userMessage, systemInstructions, model, temperature, maxTokens } = await req.json();

    // Map model names to DeepSeek API IDs
    const MODEL_MAP: Record<string, string> = {
      'DeepSeek Chat': 'deepseek-chat',
      'DeepSeek Coder': 'deepseek-coder',
      'deepseek-chat': 'deepseek-chat',
    };
    const apiModel = MODEL_MAP[model] || 'deepseek-chat';

    const completion = await deepseek.chat.completions.create({
      model: apiModel,
      messages: [
        { role: 'system', content: systemInstructions || 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens ?? 2048,
    });

    const reply = completion.choices[0].message.content;

    // Log usage
    const usage = completion.usage;
    const cost = (usage?.total_tokens || 0) * 0.000001;

    await supabase.from('ai_usage_logs').insert({
      agent_id: agentId,
      prompt: userMessage,
      response: reply,
      tokens_used: usage?.total_tokens || 0,
      cost: cost,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('AI run error:', error);
    return NextResponse.json(
      { error: `AI failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}