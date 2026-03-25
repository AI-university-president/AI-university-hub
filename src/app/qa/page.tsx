const qaItems = [
  {
    question: "社内ポータルにログインできません。",
    answer:
      "パスワード再設定を行っても解決しない場合は、ヘルプ窓口へ「社員番号・発生時刻・表示エラー」を添えて連絡してください。",
  },
  {
    question: "勤怠の打刻漏れはどこから修正できますか？",
    answer:
      "ホームの「社内アプリ一覧」から勤怠管理へ進み、打刻修正申請を提出してください。承認後に反映されます。",
  },
  {
    question: "新しい社内アプリを掲載したいです。",
    answer:
      "ホームの「アプリ登録を依頼」から申請してください。情報システム部で内容確認後、公開します。",
  },
  {
    question: "FAQに項目追加を依頼できますか？",
    answer:
      "ヘルプ窓口に「質問文・回答案・対象部署」を送ってください。内容確認後に更新します。",
  },
];

export default function QAPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-6 md:px-10 md:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold md:text-3xl">Q&A</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          よくある問い合わせをまとめています。該当しない場合はヘルプ窓口へ連絡してください。
        </p>
      </section>

      <section className="mt-6 grid gap-3">
        {qaItems.map((item) => (
          <article
            key={item.question}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Q. {item.question}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">A. {item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
