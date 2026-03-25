import { expect, test } from "@playwright/test";

type CompareRequestBody = {
  prompt: string;
  targets: Array<{
    provider: "chatgpt" | "claude" | "gemini";
    model: string;
  }>;
};

const providerLabelMap: Record<CompareRequestBody["targets"][number]["provider"], string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
};

test("LLM/モデル比較ページで複数モデル比較と部分失敗表示ができる", async ({ page }) => {
  let capturedRequest: CompareRequestBody | null = null;

  await page.route("**/api/llm/compare", async (route) => {
    const payload = route.request().postDataJSON() as CompareRequestBody;
    capturedRequest = payload;

    const results = payload.targets.map((target, index) => {
      const isFailure = index === 1;

      return {
        provider: target.provider,
        providerLabel: providerLabelMap[target.provider],
        model: target.model,
        modelLabel: target.model,
        status: isFailure ? "error" : "success",
        response: isFailure ? "" : `Mock response from ${target.provider}:${target.model}`,
        latencyMs: 120 + index * 40,
        error: isFailure ? "部分失敗テストメッセージ" : null,
      };
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results }),
    });
  });

  await page.goto("/apis/gpt-text-lab");

  await expect(page.getByRole("heading", { level: 1, name: "LLM/モデル 比較" })).toBeVisible();
  await expect(page.getByText("ChatGPT", { exact: true })).toBeVisible();
  await expect(page.getByText("Claude", { exact: true })).toBeVisible();
  await expect(page.getByText("Gemini", { exact: true })).toBeVisible();

  await page.getByLabel("GPT-5.4 mini").check();
  await page.getByLabel("Claude Sonnet 4.5").check();
  await page.getByLabel("Gemini 2.5 Flash-Lite").check();

  await expect(page.getByLabel("GPT-5.4 mini")).toBeChecked();
  await expect(page.getByLabel("Claude Sonnet 4.5")).toBeChecked();
  await expect(page.getByLabel("Gemini 2.5 Flash-Lite")).toBeChecked();

  const prompt = "同じプロンプトを複数モデルで比較するE2Eテストです。";
  await page.getByLabel("プロンプト入力欄").fill(prompt);
  await page.getByRole("button", { name: "比較を実行" }).click();

  await expect.poll(() => capturedRequest?.prompt ?? "").toBe(prompt);
  expect(capturedRequest?.targets.length ?? 0).toBeGreaterThan(1);
  expect(capturedRequest?.targets.some((target) => target.provider === "chatgpt")).toBeTruthy();
  expect(capturedRequest?.targets.some((target) => target.provider === "claude")).toBeTruthy();
  expect(capturedRequest?.targets.some((target) => target.provider === "gemini")).toBeTruthy();

  await expect(page.getByText("Mock response from chatgpt:gpt-5.4", { exact: true })).toBeVisible();
  await expect(page.getByText("Mock response from gemini:gemini-2.5-pro", { exact: true })).toBeVisible();
  await expect(page.getByText("部分失敗テストメッセージ")).toBeVisible();
});
