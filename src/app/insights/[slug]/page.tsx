import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getInsightArticleBySlug } from "@/features/insights/data/articles";

type InsightDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { slug } = await params;
  const article = getInsightArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <PageShell>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
        <Link
          href="/insights"
          className="inline-flex rounded-md px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← 技術情報一覧へ戻る
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {article.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{article.publishedAt}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">読了目安 {article.readMinutes}分</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{article.title}</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base dark:text-slate-300">{article.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <div className="mt-3 space-y-4 text-sm leading-8 text-slate-700 md:text-base dark:text-slate-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
