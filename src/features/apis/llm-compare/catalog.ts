import type { LlmModelDefinition, LlmProviderDefinition, LlmProviderId } from "@/types/llm-compare";

export const llmProviderCatalog: LlmProviderDefinition[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    description: "OpenAI の GPT 系モデル",
    enabled: true,
    models: [
      {
        id: "gpt-5.4",
        label: "GPT-5.4",
        enabled: true,
        parameterNote: "reasoning: none / text.verbosity: medium / temperature: 0.7",
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
        parameterNote: "reasoning: low / text.verbosity: low / max_output_tokens: 1536",
        params: {
          openai: {
            maxOutputTokens: 1536,
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
        parameterNote: "max_tokens: 4096 / temperature: 0.4",
        params: {
          claude: {
            maxTokens: 4096,
            temperature: 0.4,
          },
        },
      },
      {
        id: "claude-sonnet-4-5",
        label: "Claude Sonnet 4.5",
        enabled: true,
        parameterNote: "max_tokens: 3072 / temperature: 0.5",
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
        parameterNote: "max_tokens: 2048 / temperature: 0.6",
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
    description: "Google の Gemini 系モデル",
    enabled: true,
    models: [
      {
        id: "gemini-2.5-pro",
        label: "Gemini 2.5 Pro",
        enabled: true,
        parameterNote: "generationConfig: maxOutputTokens 4096 / temperature 0.4 / topP 0.9",
        params: {
          gemini: {
            maxOutputTokens: 4096,
            temperature: 0.4,
            topP: 0.9,
          },
        },
      },
      {
        id: "gemini-2.5-flash",
        label: "Gemini 2.5 Flash",
        enabled: true,
        parameterNote: "generationConfig: maxOutputTokens 2048 / temperature 0.5 / topP 0.95",
        params: {
          gemini: {
            maxOutputTokens: 2048,
            temperature: 0.5,
            topP: 0.95,
          },
        },
      },
      {
        id: "gemini-2.5-flash-lite",
        label: "Gemini 2.5 Flash-Lite",
        enabled: true,
        parameterNote: "generationConfig: maxOutputTokens 1536 / temperature 0.6 / topP 0.95",
        params: {
          gemini: {
            maxOutputTokens: 1536,
            temperature: 0.6,
            topP: 0.95,
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
