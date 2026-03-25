"use client";

import { useMemo, useState } from "react";
import type { ApiTool } from "@/features/apis/types";

type ApiPlaygroundProps = {
  tool: ApiTool;
};

export function ApiPlayground({ tool }: ApiPlaygroundProps) {
  const [input, setInput] = useState(tool.samplePrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const selectedMock = useMemo(() => {
    if (tool.mockResponseExamples.length === 0) {
      return "モックレスポンスが設定されていません。";
    }
    const seed = input.trim().length % tool.mockResponseExamples.length;
    return tool.mockResponseExamples[seed];
  }, [input, tool.mockResponseExamples]);

  async function handleRunMock() {
    setIsLoading(true);
    setResponse("");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setResponse(selectedMock);
    setIsLoading(false);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-semibold">試用エリア（モック）</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        実API接続前の体験版です。入力内容に応じてダミーレスポンスを返します。
      </p>
      <label htmlFor="prompt" className="mt-4 block text-sm font-medium">
        入力テキスト
      </label>
      <textarea
        id="prompt"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-2 h-36 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-sky-900"
      />
      <button
        type="button"
        onClick={handleRunMock}
        disabled={isLoading}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        {isLoading ? "モック実行中..." : "モック実行"}
      </button>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 dark:border-slate-700 dark:bg-slate-950">
        <p className="mb-2 font-medium text-slate-600 dark:text-slate-300">レスポンス</p>
        <p>{response || "ここにレスポンスが表示されます。"}</p>
      </div>
    </section>
  );
}
