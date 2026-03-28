import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ApiPlayground } from "@/features/apis/components/api-playground";
import { LlmModelComparePlayground } from "@/features/apis/components/llm-model-compare-playground";
import { getApiToolBySlug } from "@/features/apis/data/api-tools";

type ApiDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { slug } = await params;
  const tool = getApiToolBySlug(slug);

  if (!tool) {
    notFound();
  }
  const isCompactCaution = tool.slug === "gpt-text-lab";

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Link
          href="/apis"
          className="inline-flex rounded-md px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← API一覧へ戻る
        </Link>
        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">{tool.category}</p>
        <h1 className="mt-2 text-3xl font-bold">{tool.name}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.detail}</p>
      </section>

      {isCompactCaution ? (
        <>
          <aside className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold">注意事項</h2>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
              {tool.cautionPoints.map((point) => (
                <li key={point} className="rounded-md bg-slate-50 px-2 py-1 dark:bg-slate-800/60">
                  {point}
                </li>
              ))}
            </ul>
          </aside>
          <section className="mt-6">
            <LlmModelComparePlayground initialPrompt={tool.samplePrompt} />
          </section>
        </>
      ) : (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ApiPlayground tool={tool} />
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">注意事項</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {tool.cautionPoints.map((point) => (
                <li key={point} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                  {point}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      )}
    </PageShell>
  );
}
