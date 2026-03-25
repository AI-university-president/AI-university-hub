import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { apiCategories, apiTools } from "@/features/apis/data/api-tools";

export default function ApiCatalogPage() {
  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-sky-700 dark:text-sky-300">API Playground</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">さまざまなAPIを試す</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          LLMや注目度の高いAPIをカテゴリ別に整理しています。各詳細ページで、説明・注意事項・試用エリア（モック）を体験できます。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {apiCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {apiTools.map((tool) => (
          <article
            key={tool.slug}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{tool.category}</p>
            <h2 className="mt-2 text-xl font-semibold">{tool.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.summary}</p>
            <Link
              href={`/apis/${tool.slug}`}
              className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              詳細 / 試用へ進む
            </Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
