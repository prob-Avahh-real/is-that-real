import * as SecureStore from 'expo-secure-store';
import { FactCheckResult } from '../types';

const API_KEY_STORE_KEY = 'deepseek_api_key';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORE_KEY, key);
}

export async function getApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(API_KEY_STORE_KEY);
}

export async function factCheck(query: string): Promise<FactCheckResult> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('Please set the DeepSeek API key first.');
  }

  const systemPrompt = `You are a professional fact-checking assistant. The user provides a claim or assertion, and you must verify its truthfulness carefully.

Return the result in the following JSON format only (no additional text):
{
  "verdict": "true" | "false" | "mixed" | "uncertain",
  "confidence": 0-100,
  "reasoning": "Detailed analysis and evidence summary.",
  "sources": ["source1", "source2"]
}

Verdict definitions:
- "true": The claim is essentially true and supported by reliable evidence.
- "false": The claim is false or contradicted by evidence.
- "mixed": The claim is partially true/false or depends on context.
- "uncertain": There is not enough evidence to determine truth.

Base your assessment on reliable evidence and cite sources when available.`;

  const response = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error((err as any).error?.message || `API 错误: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  const jsonStr = content.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error('无法解析 AI 返回的结果');
    }
  }

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    query,
    verdict: parsed.verdict || 'uncertain',
    confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
    reasoning: parsed.reasoning || '无法获取分析结果',
    sources: Array.isArray(parsed.sources) ? parsed.sources : [],
    timestamp: Date.now(),
  };
}
