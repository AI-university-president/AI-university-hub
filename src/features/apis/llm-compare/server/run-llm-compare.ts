import { getModelByProvider, getProviderById } from "@/features/apis/llm-compare/catalog";
import { requestChatGptText } from "@/features/apis/llm-compare/server/providers/chatgpt-provider";
import { requestClaudeText } from "@/features/apis/llm-compare/server/providers/claude-provider";
import { requestGeminiText } from "@/features/apis/llm-compare/server/providers/gemini-provider";
import { shouldUseMockLlmResponse, toPublicErrorMessage } from "@/features/apis/llm-compare/server/provider-utils";
import type { LlmCompareRequestPayload, LlmCompareResult, LlmModelParams, LlmProviderId } from "@/types/llm-compare";

type ProviderRequestParams = {
  providerLabel: string;
  modelLabel: string;
  model: string;
  modelParams: LlmModelParams;
  prompt: string;
  timeoutMs: number;
  useMock: boolean;
};

const DEFAULT_TIMEOUT_MS = 30000;

const providerRunnerMap: Record<LlmProviderId, (params: ProviderRequestParams) => Promise<string>> = {
  chatgpt: requestChatGptText,
  claude: requestClaudeText,
  gemini: requestGeminiText,
};

function getTimeoutMs() {
  const raw = Number(process.env.LLM_COMPARE_TIMEOUT_MS);

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_TIMEOUT_MS;
  }

  return raw;
}

export async function runLlmCompare({ prompt, targets, options }: LlmCompareRequestPayload): Promise<LlmCompareResult[]> {
  const useMock = shouldUseMockLlmResponse();
  const timeoutMs = getTimeoutMs();

  return Promise.all(
    targets.map(async (target) => {
      const providerDefinition = getProviderById(target.provider);
      const modelDefinition = getModelByProvider(target.provider, target.model);
      const startedAt = Date.now();

      const providerLabel = providerDefinition?.label ?? target.provider;
      const modelLabel = modelDefinition?.label ?? target.model;

      try {
        const baseModelParams = modelDefinition?.params ?? {};
        const modelParams =
          target.provider === "chatgpt" && baseModelParams.openai
            ? {
                ...baseModelParams,
                openai: {
                  ...baseModelParams.openai,
                  ...options?.chatgpt,
                },
              }
            : target.provider === "claude" && baseModelParams.claude
              ? {
                  ...baseModelParams,
                  claude: {
                    ...baseModelParams.claude,
                    ...options?.claude,
                  },
                }
              : target.provider === "gemini" && baseModelParams.gemini
                ? {
                    ...baseModelParams,
                    gemini: {
                      ...baseModelParams.gemini,
                      ...options?.gemini,
                    },
                  }
                : baseModelParams;

        const text = await providerRunnerMap[target.provider]({
          providerLabel,
          modelLabel,
          model: target.model,
          modelParams,
          prompt,
          timeoutMs,
          useMock,
        });

        return {
          provider: target.provider,
          providerLabel,
          model: target.model,
          modelLabel,
          status: "success",
          response: text,
          latencyMs: Date.now() - startedAt,
          error: null,
        } satisfies LlmCompareResult;
      } catch (error) {
        return {
          provider: target.provider,
          providerLabel,
          model: target.model,
          modelLabel,
          status: "error",
          response: "",
          latencyMs: Date.now() - startedAt,
          error: toPublicErrorMessage(error),
        } satisfies LlmCompareResult;
      }
    }),
  );
}
