const contacts = [
  {
    team: "情報システム部",
    scope: "アカウント・端末・ネットワーク・障害対応",
    mail: "it-support@example.co.jp",
    ext: "1234",
  },
  {
    team: "人事総務",
    scope: "勤怠・休暇・入退社手続き",
    mail: "hr-help@example.co.jp",
    ext: "2210",
  },
  {
    team: "経理",
    scope: "経費精算・請求・支払処理",
    mail: "finance-help@example.co.jp",
    ext: "3320",
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-6 md:px-10 md:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold md:text-3xl">ヘルプ窓口</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          問い合わせ内容に応じて担当窓口へ連絡してください。緊急障害はチャットの障害報告チャンネルを優先してください。
        </p>
      </section>

      <section className="mt-6 grid gap-3">
        {contacts.map((contact) => (
          <article
            key={contact.team}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold">{contact.team}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{contact.scope}</p>
            <p className="mt-3 text-sm">メール: {contact.mail}</p>
            <p className="text-sm">内線: {contact.ext}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
