import Link from "next/link";

type FeatureEntryCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export function FeatureEntryCard({ title, description, href, badge }: FeatureEntryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {badge ? (
        <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {badge}
        </p>
      ) : null}
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        詳しく見る
      </Link>
    </article>
  );
}
