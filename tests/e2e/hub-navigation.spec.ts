import { expect, test } from "@playwright/test";

test("トップから API 詳細ページまで遷移できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "AI大学HUB" })).toBeVisible();
  await page.getByRole("link", { name: "API体験をはじめる" }).click();
  await expect(page.getByRole("heading", { name: "さまざまなAPIを試す" })).toBeVisible();
  await page.getByRole("link", { name: "詳細 / 試用へ進む" }).first().click();
  await expect(page.getByRole("heading", { name: "試用エリア（モック）" })).toBeVisible();
  await page.getByRole("button", { name: "モック実行" }).click();
  await expect(page.getByText("レスポンス", { exact: true })).toBeVisible();
});

test("トップから研究アプリ体験ページまで遷移できる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "研究アプリを触る" }).click();
  await expect(page.getByRole("heading", { name: "研究アプリのトライアル" })).toBeVisible();
  await page.getByRole("link", { name: "体験する" }).first().click();
  await expect(page.getByRole("heading", { name: "体験画面（モック）" })).toBeVisible();
  await page.getByRole("button", { name: "体験を実行" }).click();
  await expect(page.getByText("体験結果", { exact: true })).toBeVisible();
});

test("トップから技術情報詳細ページまで遷移できる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "技術情報を読む" }).click();
  await expect(page.getByRole("heading", { name: "有益な技術情報コンテンツ" })).toBeVisible();
  await page.getByRole("link", { name: "記事を読む" }).first().click();
  await expect(page).toHaveURL(/\/insights\//);
  await expect(page.getByRole("link", { name: "技術情報一覧へ戻る" })).toBeVisible();
});
