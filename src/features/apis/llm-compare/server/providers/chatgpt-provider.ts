import { buildMockResponse, fetchWithTimeout, readErrorMessage, shouldForceMockFailure } from "@/features/apis/llm-compare/server/provider-utils";
import type { LlmModelParams, OpenAiModelParams } from "@/types/llm-compare";

type ChatGptProviderParams = {
  providerLabel: string;
  modelLabel: string;
  model: string;
  modelParams: LlmModelParams;
  prompt: string;
  timeoutMs: number;
  useMock: boolean;
};

type OpenAiResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const DEFAULT_OPENAI_PARAMS: OpenAiModelParams = {
  maxOutputTokens: 1024,
  reasoningEffort: "none",
  textVerbosity: "medium",
};

export async function requestChatGptText({
  providerLabel,
  modelLabel,
  model,
  modelParams,
  prompt,
  timeoutMs,
  useMock,
}: ChatGptProviderParams) {
  if (useMock) {
    if (shouldForceMockFailure("chatgpt", model)) {
      throw new Error("ChatGPT モックで意図的に失敗させました。");
    }

    return buildMockResponse({
      provider: "chatgpt",
      providerLabel,
      modelLabel,
      prompt,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("ChatGPT の API キーが設定されていません。");
  }

  const openaiParams = modelParams.openai ?? DEFAULT_OPENAI_PARAMS;
  const requestBody: Record<string, unknown> = {
    model,
    input: prompt,
    max_output_tokens: openaiParams.maxOutputTokens,
    reasoning: { effort: openaiParams.reasoningEffort },
  };

  if (openaiParams.textVerbosity) {
    requestBody.text = { verbosity: openaiParams.textVerbosity };
  }

  // GPT-5.4 系では reasoning none の時のみ temperature / top_p が使えるため条件付きで送る
  if (openaiParams.reasoningEffort === "none") {
    if (typeof openaiParams.temperature === "number") {
      requestBody.temperature = openaiParams.temperature;
    }
    if (typeof openaiParams.topP === "number") {
      requestBody.top_p = openaiParams.topP;
    }
  }

  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
    timeoutMs,
  );

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(`ChatGPT API エラー: ${message}`);
  }

  const payload = (await response.json()) as OpenAiResponse;
  const textFromOutput = payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text?.trim() ?? "")
    .join("\n")
    .trim();
  const text = payload.output_text?.trim() || textFromOutput;

  if (!text) {
    throw new Error("ChatGPT から有効なレスポンスを取得できませんでした。");
  }

  return text;
}
