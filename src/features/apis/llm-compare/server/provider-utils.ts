import type { LlmProviderId } from "@/types/llm-compare";

type BuildMockResponseParams = {
  provider: LlmProviderId;
  providerLabel: string;
  modelLabel: string;
  prompt: string;
};

const PROVIDER_TRAIT: Record<LlmProviderId, string> = {
  chatgpt: "構造化された要点整理",
  claude: "文脈の丁寧な解釈",
  gemini: "実務向けの簡潔な提案",
};

export function shouldUseMockLlmResponse() {
  if (process.env.LLM_COMPARE_USE_MOCK === "true") {
    return true;
  }

  if (process.env.LLM_COMPARE_USE_MOCK === "false") {
    return false;
  }

  return false;
}

export function shouldForceMockFailure(provider: LlmProviderId, model: string) {
  const raw = process.env.LLM_COMPARE_MOCK_FAIL_MODELS;
  if (!raw) {
    return false;
  }

  const failTargets = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return failTargets.includes(`${provider}:${model}`);
}

export function buildMockResponse({ provider, providerLabel, modelLabel, prompt }: BuildMockResponseParams) {
  const normalizedPrompt = prompt.trim();
  const shortenedPrompt = normalizedPrompt.length > 140 ? `${normalizedPrompt.slice(0, 140)}...` : normalizedPrompt;
  const trait = PROVIDER_TRAIT[provider];

  return [
    `【${providerLabel} / ${modelLabel}】`,
    `同一プロンプト比較用のモック応答です。`,
    `着眼点: ${trait}`,
    `入力要約: ${shortenedPrompt || "(空の入力)"}`,
    "提案: 目的・制約・出力形式を揃えると、モデル間比較の精度が上がります。",
  ].join("\n");
}

export async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutHandle);
  }
}

export async function readErrorMessage(response: Response) {
  const responseText = await response.text();

  if (!responseText) {
    return `HTTP ${response.status}`;
  }

  try {
    const parsed = JSON.parse(responseText) as { error?: { message?: string }; message?: string };
    return parsed.error?.message ?? parsed.message ?? `HTTP ${response.status}`;
  } catch {
    return responseText;
  }
}

export function toPublicErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "不明なエラーが発生しました。";
}
