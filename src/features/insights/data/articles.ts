import type { InsightArticle } from "@/features/insights/types";

export const insightArticles: InsightArticle[] = [
  {
    slug: "ai-learning-start-guide",
    title: "AI学習を始める人のための最短スタートガイド",
    summary:
      "何から手を付けるべきか迷う人向けに、最初の2週間で押さえるべき学習手順を整理します。",
    category: "AI学習",
    tags: ["学習ロードマップ", "初学者", "キャリア"],
    publishedAt: "2026-03-20",
    readMinutes: 6,
    sections: [
      {
        heading: "最初に決めるべきはゴール",
        paragraphs: [
          "AI学習の失敗で多いのは、学ぶ内容ではなく目標設定が曖昧なことです。まずは「何を作りたいか」「どんな業務に活かしたいか」を1つに絞ると継続しやすくなります。",
          "ゴールが定まると、必要な技術の優先順位が自然に決まります。基礎理論を広く触るより、用途に直結するツールを先に触る方が成果が出やすくなります。",
        ],
      },
      {
        heading: "2週間の実践プラン",
        paragraphs: [
          "1週目は、LLMの基本操作とプロンプト改善を繰り返し、出力の質がどのように変わるかを観察します。",
          "2週目は、小さな課題を自動化するミニアプリを作り、学習結果を目に見える形にします。成果物があると次の学習計画が立てやすくなります。",
        ],
      },
    ],
  },
  {
    slug: "agent-design-checkpoints",
    title: "AIエージェント設計で先に決めるべき5つの観点",
    summary:
      "役割分担、入力品質、評価指標など、実装前に整理しておくと失敗しにくい設計観点を解説します。",
    category: "開発実装",
    tags: ["AIエージェント", "設計", "運用"],
    publishedAt: "2026-03-18",
    readMinutes: 8,
    sections: [
      {
        heading: "役割分割と責任範囲",
        paragraphs: [
          "1つのエージェントにすべてを任せると品質と保守性が下がります。入力整形、判断、出力整形を分割し、責任範囲を明確にすると改善がしやすくなります。",
          "特に運用段階では、失敗時にどこで誤りが起きたかを追跡できる構造が重要です。",
        ],
      },
      {
        heading: "評価指標は最初に置く",
        paragraphs: [
          "後から評価基準を作ると、改善の方向性がぶれます。レスポンス時間、正確性、ユーザー満足度など、最小限の指標を最初に決めましょう。",
          "数値化しづらい品質も、レビュー観点を固定することで比較しやすくなります。",
        ],
      },
    ],
  },
  {
    slug: "tool-stack-2026",
    title: "2026年版: AI開発ツールを選ぶときの実践基準",
    summary:
      "フレームワーク選定で迷わないために、学習コスト・拡張性・運用性の3軸で比較する方法を紹介します。",
    category: "ツール活用",
    tags: ["ツール比較", "生産性", "導入検討"],
    publishedAt: "2026-03-15",
    readMinutes: 7,
    sections: [
      {
        heading: "比較の軸を固定する",
        paragraphs: [
          "新しいツールは魅力的に見えますが、比較軸がないと判断が感覚的になります。開発体験、運用性、チーム導入のしやすさを固定し、同じ尺度で見ることが重要です。",
          "短期的な実装速度だけでなく、半年後の保守コストを見積もる視点が導入成功につながります。",
        ],
      },
      {
        heading: "まずは小さな検証で判断する",
        paragraphs: [
          "いきなり本番導入せず、限定的なPoCで品質とチーム相性を確認することをおすすめします。",
          "比較結果をドキュメント化しておくと、将来の見直しやメンバー交代時にも判断根拠を引き継げます。",
        ],
      },
    ],
  },
];

export const insightCategories = Array.from(new Set(insightArticles.map((article) => article.category)));

export function getInsightArticleBySlug(slug: string) {
  return insightArticles.find((article) => article.slug === slug);
}
