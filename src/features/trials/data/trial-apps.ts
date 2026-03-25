import type { TrialApp } from "@/features/trials/types";

export const trialApps: TrialApp[] = [
  {
    slug: "prompt-coach",
    title: "Prompt Coach",
    summary: "目的に合わせたプロンプト改善案を提案する研究アプリ",
    purpose: "LLM出力を安定させるためのプロンプト設計支援",
    targetUser: "生成AIを使い始めたばかりの学習者・企画担当者",
    demoMode: "assistant",
    demoPlaceholder: "試したいプロンプト案を入力してください",
  },
  {
    slug: "idea-signal-map",
    title: "Idea Signal Map",
    summary: "アイデアの新規性と実現性を可視化する評価トライアル",
    purpose: "企画段階での論点整理と優先順位付けの支援",
    targetUser: "新規事業・研究テーマを検討しているチーム",
    demoMode: "scoreboard",
    demoPlaceholder: "評価したいアイデアを入力してください",
  },
  {
    slug: "study-roadmap-builder",
    title: "Study Roadmap Builder",
    summary: "目標に合わせた学習ロードマップを生成する体験アプリ",
    purpose: "AI学習の継続を支える学習計画の設計",
    targetUser: "独学でAIを学びたい初学者・学生・社会人",
    demoMode: "planner",
    demoPlaceholder: "達成したい目標を入力してください",
  },
];

export function getTrialAppBySlug(slug: string) {
  return trialApps.find((app) => app.slug === slug);
}
