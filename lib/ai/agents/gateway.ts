import OpenAI from "openai";

export function getAIClient(providerSlug: string, modelSlug: string) {
  if (providerSlug === "deepseek") {
    return {
      client: new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY!, baseURL: "https://api.deepseek.com" }),
      model: modelSlug,
      pricing: { input: 0.00014, output: 0.00028 }
    };
  }
  if (providerSlug === "openai") {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
      model: modelSlug,
      pricing: { input: 0.01, output: 0.03 }
    };
  }
  // For Claude, Gemini, Llama, Groq etc - use OpenRouter (one key)
  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: { "HTTP-Referer": "http://localhost:3000", "X-Title": "AI SalesOS" }
  });
  const map: any = {
    "claude-3-sonnet": "anthropic/claude-3-sonnet",
    "claude-3-opus": "anthropic/claude-3-opus",
    "gemini-pro": "google/gemini-pro",
    "mistral-large": "mistralai/mistral-large",
    "llama-3-70b": "meta-llama/llama-3-70b-instruct",
  };
  return { client, model: map[modelSlug] || modelSlug, pricing: { input: 0.003, output: 0.015 } };
}