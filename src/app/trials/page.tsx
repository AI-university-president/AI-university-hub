import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { trialApps } from "@/features/trials/data/trial-apps";

export default function TrialsPage() {
  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Research App Trial</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">研究アプリのトライアル</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
          AI大学の研究で作成したアプリを一覧で掲載しています。用途・対象ユーザーを確認し、個別ページで体験できます。
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {trialApps.map((app) => (
          <article
            key={app.slug}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold">{app.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{app.summary}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-medium text-slate-700 dark:text-slate-200">用途</dt>
                <dd className="text-slate-600 dark:text-slate-300">{app.purpose}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700 dark:text-slate-200">対象ユーザー</dt>
                <dd className="text-slate-600 dark:text-slate-300">{app.targetUser}</dd>
              </div>
            </dl>
            <Link
              href={`/trials/${app.slug}`}
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              体験する
            </Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
