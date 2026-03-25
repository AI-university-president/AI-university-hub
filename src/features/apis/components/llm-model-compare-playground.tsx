"use client";

import { useMemo, useState } from "react";
import { llmProviderCatalog } from "@/features/apis/llm-compare/catalog";
import { llmCompareResponseSchema } from "@/features/apis/llm-compare/schema";
import type { LlmCompareResult, LlmRequestTarget } from "@/types/llm-compare";

type LlmModelComparePlaygroundProps = {
  initialPrompt: string;
};

const TARGET_KEY_SEPARATOR = "::";

function buildTargetKey(target: LlmRequestTarget) {
  return `${target.provider}${TARGET_KEY_SEPARATOR}${target.model}`;
}

function parseTargetKey(key: string): LlmRequestTarget | null {
  const [provider, model] = key.split(TARGET_KEY_SEPARATOR);
  if (!provider || !model) {
    return null;
  }

  if (provider !== "chatgpt" && provider !== "claude" && provider !== "gemini") {
    return null;
  }

  return {
    provider,
    model,
  };
}

const DEFAULT_SELECTED_TARGET_KEYS = llmProviderCatalog.flatMap((provider) => {
  const defaultModel = provider.models.find((model) => model.enabled);
  if (!defaultModel) {
    return [];
  }

  return [buildTargetKey({ provider: provider.id, model: defaultModel.id })];
});

export function LlmModelComparePlayground({ initialPrompt }: LlmModelComparePlaygroundProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedTargetKeys, setSelectedTargetKeys] = useState<string[]>(DEFAULT_SELECTED_TARGET_KEYS);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [results, setResults] = useState<LlmCompareResult[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedTargets = useMemo(() => {
    return selectedTargetKeys
      .map((key) => parseTargetKey(key))
      .filter((target): target is LlmRequestTarget => target !== null);
  }, [selectedTargetKeys]);

  const resultOrder = useMemo(() => {
    return new Map(selectedTargets.map((target, index) => [buildTargetKey(target), index]));
  }, [selectedTargets]);

  function toggleTarget(target: LlmRequestTarget) {
    const targetKey = buildTargetKey(target);
    setSelectedTargetKeys((prev) => {
      if (prev.includes(targetKey)) {
        return prev.filter((key) => key !== targetKey);
      }
      return [...prev, targetKey];
    });
  }

  async function handleRunCompare() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setValidationError("プロンプトを入力してください。");
      return;
    }

    if (selectedTargets.length === 0) {
      setValidationError("比較対象のモデルを1つ以上選択してください。");
      return;
    }

    setValidationError(null);
    setRequestError(null);
    setCopiedKey(null);
    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/llm/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          targets: selectedTargets,
        }),
      });

      const responseText = await response.text();
      let payload: unknown = null;

      if (responseText) {
        try {
          payload = JSON.parse(responseText) as unknown;
        } catch {
          if (!response.ok) {
            throw new Error(`サーバーエラー (${response.status}) が発生しました。`);
          }
          throw new Error("サーバーレスポンスの解析に失敗しました。");
        }
      }

      if (!response.ok) {
        const message =
          typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : "比較リクエストに失敗しました。";
        throw new Error(message);
      }

      const parsed = llmCompareResponseSchema.parse(payload);
      const sortedResults = [...parsed.results].sort((a, b) => {
        const indexA = resultOrder.get(buildTargetKey({ provider: a.provider, model: a.model })) ?? Number.MAX_SAFE_INTEGER;
        const indexB = resultOrder.get(buildTargetKey({ provider: b.provider, model: b.model })) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
      });
      setResults(sortedResults);
    } catch (error) {
      const message = error instanceof Error ? error.message : "比較リクエストに失敗しました。";
      setRequestError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy(result: LlmCompareResult) {
    if (!result.response) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.response);
      setCopiedKey(buildTargetKey({ provider: result.provider, model: result.model }));
    } catch {
      setRequestError("クリップボードへのコピーに失敗しました。");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-semibold">LLM/モデル 比較</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        同じプロンプトを複数モデルに送り、回答の違いを並べて確認できます。比較したいモデルを選び、実行してください。
      </p>

      <label htmlFor="llm-compare-prompt" className="mt-4 block text-sm font-medium">
        プロンプト入力欄
      </label>
      <textarea
        id="llm-compare-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        className="mt-2 h-36 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-sky-900"
      />

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">LLM/モデル選択エリア</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {llmProviderCatalog
            .filter((provider) => provider.enabled)
            .map((provider) => (
              <article
                key={provider.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"
              >
                <h4 className="text-sm font-semibold">{provider.label}</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{provider.description}</p>
                <div className="mt-3 space-y-2">
                  {provider.models
                    .filter((model) => model.enabled)
                    .map((model) => {
                      const target = { provider: provider.id, model: model.id } satisfies LlmRequestTarget;
                      const targetKey = buildTargetKey(target);
                      const isChecked = selectedTargetKeys.includes(targetKey);

                      return (
                        <div key={model.id} className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTarget(target)}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                            />
                            <span>{model.label}</span>
                          </label>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{model.parameterNote}</p>
                        </div>
                      );
                    })}
                </div>
              </article>
            ))}
        </div>
      </div>

      {validationError ? (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          {validationError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleRunCompare}
        disabled={isLoading}
        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        {isLoading ? "比較実行中..." : "比較を実行"}
      </button>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">比較結果エリア</h3>
          {isLoading ? (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">
              実行中
            </span>
          ) : null}
        </div>

        {requestError ? (
          <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
            {requestError}
          </p>
        ) : null}

        {!isLoading && results.length === 0 && !requestError ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">ここに比較結果が表示されます。</p>
        ) : null}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {results.map((result) => {
            const resultKey = buildTargetKey({ provider: result.provider, model: result.model });
            return (
              <article
                key={resultKey}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{result.providerLabel}</p>
                    <h4 className="text-sm font-semibold">{result.modelLabel}</h4>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      result.status === "success"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                    }`}
                  >
                    {result.status === "success" ? "成功" : "失敗"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">応答時間: {result.latencyMs}ms</p>

                {result.status === "success" ? (
                  <>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800 dark:text-slate-100">
                      {result.response}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(result)}
                      className="mt-3 rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {copiedKey === resultKey ? "コピー済み" : "回答をコピー"}
                    </button>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-red-700 dark:text-red-300">
                    {result.error ?? "モデル呼び出しに失敗しました。"}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
