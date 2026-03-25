export const llmProviderIds = ["chatgpt", "claude", "gemini"] as const;

export type LlmProviderId = (typeof llmProviderIds)[number];

export type LlmExecutionStatus = "success" | "error";

export type OpenAiModelParams = {
  maxOutputTokens: number;
  reasoningEffort: "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
  textVerbosity?: "low" | "medium" | "high";
  temperature?: number;
  topP?: number;
};

export type ClaudeModelParams = {
  maxTokens: number;
  temperature?: number;
};

export type GeminiModelParams = {
  maxOutputTokens: number;
  temperature?: number;
  topP?: number;
  topK?: number;
};

export type LlmModelParams = {
  openai?: OpenAiModelParams;
  claude?: ClaudeModelParams;
  gemini?: GeminiModelParams;
};

export type LlmModelDefinition = {
  id: string;
  label: string;
  enabled: boolean;
  parameterNote: string;
  params: LlmModelParams;
};

export type LlmProviderDefinition = {
  id: LlmProviderId;
  label: string;
  description: string;
  enabled: boolean;
  models: LlmModelDefinition[];
};

export type LlmRequestTarget = {
  provider: LlmProviderId;
  model: string;
};

export type LlmCompareRequestPayload = {
  prompt: string;
  targets: LlmRequestTarget[];
};

export type LlmCompareResult = {
  provider: LlmProviderId;
  providerLabel: string;
  model: string;
  modelLabel: string;
  status: LlmExecutionStatus;
  response: string;
  latencyMs: number;
  error: string | null;
};

export type LlmCompareResponsePayload = {
  results: LlmCompareResult[];
};
