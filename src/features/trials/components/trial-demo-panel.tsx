"use client";

import { useState } from "react";
import type { TrialApp } from "@/features/trials/types";

type TrialDemoPanelProps = {
  app: TrialApp;
};

export function TrialDemoPanel({ app }: TrialDemoPanelProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("ここに体験結果が表示されます。");

  function runDemo() {
    const baseInput = input.trim() || "サンプル入力";

    if (app.demoMode === "assistant") {
      setOutput(
        `改善提案: 「${baseInput}」は目的・制約・出力形式を明示すると精度が上がります。例: 目的 / 前提 / 出力フォーマットの3要素で再構成してください。`,
      );
      return;
    }

    if (app.demoMode === "scoreboard") {
      const novelty = 68 + (baseInput.length % 25);
      const feasibility = 55 + (baseInput.length % 35);
      setOutput(
        `評価結果: 新規性 ${novelty}点 / 実現性 ${feasibility}点。次のアクション: 最小検証の対象ユーザーを1つに絞り、評価指標を2つ設定してください。`,
      );
      return;
    }

    setOutput(
      `学習計画案: 「${baseInput}」達成に向けて、1週目は基礎理解、2週目はハンズオン、3週目はミニ制作、4週目は振り返りと改善に取り組みましょう。`,
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-semibold">体験画面（モック）</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        実運用前の試作UIです。挙動確認と導線検証を目的にしています。
      </p>
      <label htmlFor="trial-input" className="mt-4 block text-sm font-medium">
        入力
      </label>
      <textarea
        id="trial-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={app.demoPlaceholder}
        className="mt-2 h-32 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-sky-900"
      />
      <button
        type="button"
        onClick={runDemo}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        体験を実行
      </button>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 dark:border-slate-700 dark:bg-slate-950">
        <p className="mb-2 font-medium text-slate-600 dark:text-slate-300">体験結果</p>
        <p>{output}</p>
      </div>
    </section>
  );
}
