import Link from "next/link";
import { FeatureEntryCard } from "@/components/feature-entry-card";
import { PageShell } from "@/components/page-shell";
import { apiTools } from "@/features/apis/data/api-tools";
import { insightArticles } from "@/features/insights/data/articles";
import { trialApps } from "@/features/trials/data/trial-apps";

const featureEntries = [
  {
    title: "さまざまなAPIを試す",
    description:
      "LLM・画像理解・音声認識など、注目APIを一覧で比較しながら試用できます。用途や注意点を確認しつつ体験可能です。",
    href: "/apis",
    badge: "Try APIs",
  },
  {
    title: "研究アプリを体験する",
    description:
      "AI大学の研究で作成したアプリをトライアル形式で公開。触って試せる導線を用意し、今後の追加にも対応しています。",
    href: "/trials",
    badge: "Hands-on",
  },
  {
    title: "技術情報を学ぶ",
    description:
      "AI開発やツール活用の実践記事をカテゴリとタグで整理。読みやすい構成で、継続学習を後押しします。",
    href: "/insights",
    badge: "Learn",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PageShell>
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
          <div className="pointer-events-none absolute right-[-120px] top-[-80px] h-72 w-72 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-900/40" />
          <div className="pointer-events-none absolute bottom-[-120px] left-[-90px] h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/30" />
          <p className="relative text-sm font-medium text-sky-700 dark:text-sky-300">AI大学 視聴者向けオープンサイト</p>
          <h1 className="relative mt-3 text-3xl font-bold leading-tight md:text-5xl">AI大学HUB</h1>
          <p className="relative mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
            AIに興味があるユーザーが「試せる・学べる・触れられる」体験を、ひとつの場所で完結できるHUBです。まずは気になるコンテンツを選び、実際に手を動かしながら理解を深めてください。
          </p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link
              href="/apis"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              API体験をはじめる
            </Link>
            <Link
              href="/trials"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              研究アプリを触る
            </Link>
            <Link
              href="/insights"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              技術情報を読む
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">公開中のAPI体験</p>
            <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">{apiTools.length}件</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">研究アプリ体験</p>
            <p className="mt-2 text-3xl font-bold text-violet-600 dark:text-violet-400">{trialApps.length}件</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">技術記事</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {insightArticles.length}本
            </p>
          </article>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">まずはこの3つから</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              初見ユーザーでも迷わないように、主要機能をカードで整理しています。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featureEntries.map((entry) => (
              <FeatureEntryCard key={entry.title} {...entry} />
            ))}
          </div>
        </section>
      </PageShell>
    </div>
  );
}
