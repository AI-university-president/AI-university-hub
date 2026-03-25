import { z } from "zod";
import { getModelByProvider, getProviderById } from "@/features/apis/llm-compare/catalog";
import { llmProviderIds } from "@/types/llm-compare";

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
