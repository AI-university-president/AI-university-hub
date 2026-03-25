import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getTrialAppBySlug } from "@/features/trials/data/trial-apps";
import { TrialDemoPanel } from "@/features/trials/components/trial-demo-panel";

type TrialDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TrialDetailPage({ params }: TrialDetailPageProps) {
  const { slug } = await params;
  const app = getTrialAppBySlug(slug);

  if (!app) {
    notFound();
  }

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Link
          href="/trials"
          className="inline-flex rounded-md px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← トライアル一覧へ戻る
        </Link>
        <h1 className="mt-3 text-3xl font-bold">{app.title}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{app.summary}</p>
        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <dt className="text-sm font-medium text-slate-700 dark:text-slate-200">用途</dt>
            <dd className="mt-1 text-sm text-slate-600 dark:text-slate-300">{app.purpose}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <dt className="text-sm font-medium text-slate-700 dark:text-slate-200">対象ユーザー</dt>
            <dd className="mt-1 text-sm text-slate-600 dark:text-slate-300">{app.targetUser}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6">
        <TrialDemoPanel app={app} />
      </section>
    </PageShell>
  );
}
