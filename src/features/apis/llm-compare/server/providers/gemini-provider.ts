import { buildMockResponse, fetchWithTimeout, readErrorMessage, shouldForceMockFailure } from "@/features/apis/llm-compare/server/provider-utils";
import type { GeminiModelParams, LlmModelParams } from "@/types/llm-compare";

type GeminiProviderParams = {
  providerLabel: string;
  modelLabel: string;
  model: string;
  modelParams: LlmModelParams;
  prompt: string;
  timeoutMs: number;
  useMock: boolean;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const DEFAULT_GEMINI_PARAMS: GeminiModelParams = {
  maxOutputTokens: 1024,
  temperature: 0.6,
  topP: 0.95,
};

export async function requestGeminiText({
  providerLabel,
  modelLabel,
  model,
  modelParams,
  prompt,
  timeoutMs,
  useMock,
}: GeminiProviderParams) {
  if (useMock) {
    if (shouldForceMockFailure("gemini", model)) {
      throw new Error("Gemini モックで意図的に失敗させました。");
    }

    return buildMockResponse({
      provider: "gemini",
      providerLabel,
      modelLabel,
      prompt,
    });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini の API キーが設定されていません。");
  }

  const geminiParams = modelParams.gemini ?? DEFAULT_GEMINI_PARAMS;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  const response = await fetchWithTimeout(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: geminiParams.maxOutputTokens,
          temperature: geminiParams.temperature,
          topP: geminiParams.topP,
          topK: geminiParams.topK,
        },
      }),
    },
    timeoutMs,
  );

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(`Gemini API エラー: ${message}`);
  }

  const payload = (await response.json()) as GeminiGenerateContentResponse;
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text?.trim() ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini から有効なレスポンスを取得できませんでした。");
  }

  return text;
}
