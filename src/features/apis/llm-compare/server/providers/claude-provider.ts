import { buildMockResponse, fetchWithTimeout, readErrorMessage, shouldForceMockFailure } from "@/features/apis/llm-compare/server/provider-utils";
import type { ClaudeModelParams, LlmModelParams } from "@/types/llm-compare";

type ClaudeProviderParams = {
  providerLabel: string;
  modelLabel: string;
  model: string;
  modelParams: LlmModelParams;
  prompt: string;
  timeoutMs: number;
  useMock: boolean;
};

type ClaudeMessageResponse = {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

const DEFAULT_CLAUDE_PARAMS: ClaudeModelParams = {
  maxTokens: 1024,
  temperature: 0.5,
};

export async function requestClaudeText({
  providerLabel,
  modelLabel,
  model,
  modelParams,
  prompt,
  timeoutMs,
  useMock,
}: ClaudeProviderParams) {
  if (useMock) {
    if (shouldForceMockFailure("claude", model)) {
      throw new Error("Claude モックで意図的に失敗させました。");
    }

    return buildMockResponse({
      provider: "claude",
      providerLabel,
      modelLabel,
      prompt,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Claude の API キーが設定されていません。");
  }

  const claudeParams = modelParams.claude ?? DEFAULT_CLAUDE_PARAMS;
  const response = await fetchWithTimeout(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: claudeParams.maxTokens,
        temperature: claudeParams.temperature,
        messages: [{ role: "user", content: prompt }],
      }),
    },
    timeoutMs,
  );

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(`Claude API エラー: ${message}`);
  }

  const payload = (await response.json()) as ClaudeMessageResponse;
  const text = payload.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text?.trim() ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Claude から有効なレスポンスを取得できませんでした。");
  }

  return text;
}
