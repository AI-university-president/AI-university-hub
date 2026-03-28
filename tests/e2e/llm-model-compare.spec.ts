import { expect, test } from "@playwright/test";

type CompareRequestBody = {
  prompt: string;
  targets: Array<{
    provider: "chatgpt" | "claude" | "gemini";
    model: string;
  }>;
  options?: {
    chatgpt?: {
      reasoningEffort?: "none" | "low" | "medium" | "high" | "xhigh";
      textVerbosity?: "low" | "medium" | "high";
      maxOutputTokens?: number;
      temperature?: number;
      topP?: number;
    };
    claude?: {
      maxTokens?: number;
      temperature?: number;
    };
    gemini?: {
      maxOutputTokens?: number;
      temperature?: number;
      topP?: number;
      topK?: number;
    };
  };
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
  await expect(page.getByLabel("GPT-5.4")).not.toBeChecked();
  await expect(page.getByLabel("Gemini 3.1 Pro")).not.toBeChecked();

  await page.getByLabel("GPT-5.4 mini").check();
  await page.getByLabel("Claude Sonnet 4.6").check();
  await page.getByLabel("Gemini 3.1 Flash-Lite").check();
  await page.getByLabel("ChatGPT リーズニングエフォート").selectOption("high");
  await page.getByLabel("Text verbosity").selectOption("high");
  await page.getByLabel("ChatGPT max output tokens").fill("1536");
  await page.getByLabel("Claude max tokens").fill("1536");
  await page.getByLabel("Gemini topK").fill("32");

  await expect(page.getByLabel("GPT-5.4 mini")).toBeChecked();
  await expect(page.getByLabel("Claude Sonnet 4.6")).toBeChecked();
  await expect(page.getByLabel("Gemini 3.1 Flash-Lite")).toBeChecked();

  const prompt = "同じプロンプトを複数モデルで比較するE2Eテストです。";
  await page.getByLabel("プロンプト入力欄").fill(prompt);
  await page.getByRole("button", { name: "比較を実行" }).click();

  await expect.poll(() => capturedRequest?.prompt ?? "").toBe(prompt);
  expect(capturedRequest).not.toBeNull();
  if (!capturedRequest) {
    throw new Error("比較リクエストが取得できませんでした。");
  }
  const compareRequest: CompareRequestBody = capturedRequest;

  expect(compareRequest.targets).toEqual([
    { provider: "chatgpt", model: "gpt-5.4-mini" },
    { provider: "claude", model: "claude-sonnet-4-6" },
    { provider: "gemini", model: "gemini-3.1-flash-lite-preview" },
  ]);
  expect(compareRequest.options?.chatgpt?.reasoningEffort).toBe("high");
  expect(compareRequest.options?.chatgpt?.textVerbosity).toBe("high");
  expect(compareRequest.options?.chatgpt?.maxOutputTokens).toBe(1536);
  expect(compareRequest.options?.claude?.maxTokens).toBe(1536);
  expect(compareRequest.options?.gemini?.topK).toBe(32);

  await expect(page.getByText("Mock response from chatgpt:gpt-5.4-mini", { exact: true })).toBeVisible();
  await expect(page.getByText("Mock response from gemini:gemini-3.1-flash-lite-preview", { exact: true })).toBeVisible();
  await expect(page.getByText("部分失敗テストメッセージ")).toBeVisible();
});
