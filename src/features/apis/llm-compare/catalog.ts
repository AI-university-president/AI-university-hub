import type { LlmModelDefinition, LlmProviderDefinition, LlmProviderId } from "@/types/llm-compare";

export const llmProviderCatalog: LlmProviderDefinition[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    description: "OpenAI の GPT-5.4 系モデル",
    enabled: true,
    models: [
      {
        id: "gpt-5.4",
        label: "GPT-5.4",
        enabled: true,
        parameterNote: "フラッグシップ / 最新旗艦モデル",
        params: {
          openai: {
            maxOutputTokens: 2048,
            reasoningEffort: "none",
            textVerbosity: "medium",
            temperature: 0.7,
          },
        },
      },
      {
        id: "gpt-5.4-mini",
        label: "GPT-5.4 mini",
        enabled: true,
        parameterNote: "軽量・高速 / 低コスト・低レイテンシ",
        params: {
          openai: {
            maxOutputTokens: 1536,
            reasoningEffort: "low",
            textVerbosity: "low",
          },
        },
      },
      {
        id: "gpt-5.4-nano",
        label: "GPT-5.4 nano",
        enabled: true,
        parameterNote: "超軽量 / 最速・最低コスト",
        params: {
          openai: {
            maxOutputTokens: 1024,
            reasoningEffort: "low",
            textVerbosity: "low",
          },
        },
      },
    ],
  },
  {
    id: "claude",
    label: "Claude",
    description: "Anthropic の Claude 系モデル",
    enabled: true,
    models: [
      {
        id: "claude-opus-4-6",
        label: "Claude Opus 4.6",
        enabled: true,
        parameterNote: "フラッグシップ / 高性能・適応思考",
        params: {
          claude: {
            maxTokens: 4096,
            temperature: 0.4,
          },
        },
      },
      {
        id: "claude-sonnet-4-6",
        label: "Claude Sonnet 4.6",
        enabled: true,
        parameterNote: "バランス / 速度と品質の両立",
        params: {
          claude: {
            maxTokens: 3072,
            temperature: 0.5,
          },
        },
      },
      {
        id: "claude-haiku-4-5",
        label: "Claude Haiku 4.5",
        enabled: true,
        parameterNote: "高速 / フロンティア級知性の最速モデル",
        params: {
          claude: {
            maxTokens: 2048,
            temperature: 0.6,
          },
        },
      },
    ],
  },
  {
    id: "gemini",
    label: "Gemini",
    description: "Google の Gemini 3 / 3.1 系モデル",
    enabled: true,
    models: [
      {
        id: "gemini-3.1-pro-preview",
        label: "Gemini 3.1 Pro",
        enabled: true,
        parameterNote: "フラッグシップ / 思考・トークン効率向上",
        params: {
          gemini: {
            maxOutputTokens: 4096,
            temperature: 0.4,
            topP: 0.9,
          },
        },
      },
      {
        id: "gemini-3-pro-preview",
        label: "Gemini 3 Pro",
        enabled: true,
        parameterNote: "フラッグシップ / 最安コスト帯で高推論性能",
        params: {
          gemini: {
            maxOutputTokens: 4096,
            temperature: 0.4,
            topP: 0.95,
          },
        },
      },
      {
        id: "gemini-3-flash-preview",
        label: "Gemini 3 Flash",
        enabled: true,
        parameterNote: "バランス / スピード・スケール・品質",
        params: {
          gemini: {
            maxOutputTokens: 2048,
            temperature: 0.5,
            topP: 0.95,
          },
        },
      },
      {
        id: "gemini-3.1-flash-lite-preview",
        label: "Gemini 3.1 Flash-Lite",
        enabled: true,
        parameterNote: "超高速・軽量 / 大量エージェントタスク向け",
        params: {
          gemini: {
            maxOutputTokens: 1536,
            temperature: 0.6,
            topP: 0.95,
          },
        },
      },
      {
        id: "gemini-3.1-flash-image-preview",
        label: "Gemini 3.1 Flash Image",
        enabled: true,
        parameterNote: "画像生成 / 主流画質帯の高速生成",
        params: {
          gemini: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.95,
          },
        },
      },
      {
        id: "gemini-3-pro-image-preview",
        label: "Gemini 3 Pro Image",
        enabled: true,
        parameterNote: "画像生成 / 高品質編集・生成向け",
        params: {
          gemini: {
            maxOutputTokens: 1024,
            temperature: 0.6,
            topP: 0.9,
          },
        },
      },
    ],
  },
];

const providerMap = new Map<LlmProviderId, LlmProviderDefinition>(
  llmProviderCatalog.map((provider) => [provider.id, provider]),
);

export function getEnabledProviders() {
  return llmProviderCatalog.filter((provider) => provider.enabled);
}

export function getProviderById(providerId: LlmProviderId) {
  return providerMap.get(providerId) ?? null;
}

export function getModelByProvider(providerId: LlmProviderId, modelId: string): LlmModelDefinition | null {
  const provider = getProviderById(providerId);
  if (!provider) {
    return null;
  }

  return provider.models.find((model) => model.id === modelId) ?? null;
}
