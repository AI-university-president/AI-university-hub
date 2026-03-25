export type TrialDemoMode = "assistant" | "scoreboard" | "planner";

export type TrialApp = {
  slug: string;
  title: string;
  summary: string;
  purpose: string;
  targetUser: string;
  demoMode: TrialDemoMode;
  demoPlaceholder: string;
};
