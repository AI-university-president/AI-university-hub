import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { insightArticles, insightCategories } from "@/features/insights/data/articles";

export default function InsightsPage() {
  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Knowledge Media</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">有益な技術情報コンテンツ</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          AI / 開発 / ツール活用に関する実践知をまとめた情報ページです。カテゴリ・タグを使って必要な記事に素早くアクセスできます。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {insightCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {insightArticles.map((article) => (
          <article
            key={article.slug}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {article.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{article.publishedAt}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">読了目安 {article.readMinutes}分</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">{article.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{article.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Link
              href={`/insights/${article.slug}`}
              className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              記事を読む
            </Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
