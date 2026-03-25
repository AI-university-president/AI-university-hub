export type InsightArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type InsightArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readMinutes: number;
  sections: InsightArticleSection[];
};
