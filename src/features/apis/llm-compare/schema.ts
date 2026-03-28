import { z } from "zod";
import { getModelByProvider, getProviderById } from "@/features/apis/llm-compare/catalog";
import { llmProviderIds, openAiReasoningEfforts, openAiTextVerbosities } from "@/types/llm-compare";

const llmTargetSchema = z
  .object({
    provider: z.enum(llmProviderIds),
    model: z.string().min(1),
  })
  .superRefine((value, ctx) => {
    const provider = getProviderById(value.provider);
    const model = getModelByProvider(value.provider, value.model);

    if (!provider || !provider.enabled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "選択されたプロバイダは利用できません。",
      });
      return;
    }

    if (!model || !model.enabled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "選択されたモデルは利用できません。",
      });
    }
  });

export const llmCompareRequestSchema = z
  .object({
    prompt: z.string().trim().min(1, "プロンプトを入力してください。").max(4000, "プロンプトが長すぎます。"),
    targets: z.array(llmTargetSchema).min(1, "少なくとも1つのモデルを選択してください。"),
    options: z
      .object({
        chatgpt: z
          .object({
            reasoningEffort: z.enum(openAiReasoningEfforts).optional(),
            textVerbosity: z.enum(openAiTextVerbosities).optional(),
            maxOutputTokens: z.number().int().min(16).optional(),
            temperature: z.number().min(0).max(2).optional(),
            topP: z.number().min(0).max(1).optional(),
          })
          .optional(),
        claude: z
          .object({
            maxTokens: z.number().int().positive().optional(),
            temperature: z.number().min(0).max(1).optional(),
          })
          .optional(),
        gemini: z
          .object({
            maxOutputTokens: z.number().int().positive().optional(),
            temperature: z.number().min(0).max(2).optional(),
            topP: z.number().min(0).max(1).optional(),
            topK: z.number().int().positive().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .superRefine((value, ctx) => {
    const keySet = new Set<string>();

    for (const target of value.targets) {
      const key = `${target.provider}:${target.model}`;
      if (keySet.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "同じモデルが重複して選択されています。",
          path: ["targets"],
        });
        return;
      }
      keySet.add(key);
    }

    const selectedChatGptMaxOutputTokens = value.targets
      .filter((target) => target.provider === "chatgpt")
      .map((target) => getModelByProvider("chatgpt", target.model)?.params.openai?.maxOutputTokens)
      .filter((tokens): tokens is number => typeof tokens === "number");
    const selectedClaudeMaxTokens = value.targets
      .filter((target) => target.provider === "claude")
      .map((target) => getModelByProvider("claude", target.model)?.params.claude?.maxTokens)
      .filter((tokens): tokens is number => typeof tokens === "number");
    const selectedGeminiMaxOutputTokens = value.targets
      .filter((target) => target.provider === "gemini")
      .map((target) => getModelByProvider("gemini", target.model)?.params.gemini?.maxOutputTokens)
      .filter((tokens): tokens is number => typeof tokens === "number");

    const chatGptLimit =
      selectedChatGptMaxOutputTokens.length > 0 ? Math.min(...selectedChatGptMaxOutputTokens) : undefined;
    const claudeLimit = selectedClaudeMaxTokens.length > 0 ? Math.min(...selectedClaudeMaxTokens) : undefined;
    const geminiLimit =
      selectedGeminiMaxOutputTokens.length > 0 ? Math.min(...selectedGeminiMaxOutputTokens) : undefined;

    if (
      typeof chatGptLimit === "number" &&
      typeof value.options?.chatgpt?.maxOutputTokens === "number" &&
      value.options.chatgpt.maxOutputTokens > chatGptLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options", "chatgpt", "maxOutputTokens"],
        message: `ChatGPT max output tokens は選択モデル上限(${chatGptLimit})以下にしてください。`,
      });
    }

    if (
      typeof claudeLimit === "number" &&
      typeof value.options?.claude?.maxTokens === "number" &&
      value.options.claude.maxTokens > claudeLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options", "claude", "maxTokens"],
        message: `Claude max tokens は選択モデル上限(${claudeLimit})以下にしてください。`,
      });
    }

    if (
      typeof geminiLimit === "number" &&
      typeof value.options?.gemini?.maxOutputTokens === "number" &&
      value.options.gemini.maxOutputTokens > geminiLimit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options", "gemini", "maxOutputTokens"],
        message: `Gemini max output tokens は選択モデル上限(${geminiLimit})以下にしてください。`,
      });
    }
  });

export const llmCompareResultSchema = z.object({
  provider: z.enum(llmProviderIds),
  providerLabel: z.string().min(1),
  model: z.string().min(1),
  modelLabel: z.string().min(1),
  status: z.enum(["success", "error"]),
  response: z.string(),
  latencyMs: z.number().int().nonnegative(),
  error: z.string().nullable(),
});

export const llmCompareResponseSchema = z.object({
  results: z.array(llmCompareResultSchema),
});
