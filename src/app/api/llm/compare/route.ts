import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { llmCompareRequestSchema, llmCompareResponseSchema } from "@/features/apis/llm-compare/schema";
import { runLlmCompare } from "@/features/apis/llm-compare/server/run-llm-compare";

export const runtime = "nodejs";

function toValidationMessage(error: ZodError) {
  const issue = error.issues[0];
  return issue?.message ?? "リクエスト形式が不正です。";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = llmCompareRequestSchema.parse(json);
    const results = await runLlmCompare(parsed);
    const payload = llmCompareResponseSchema.parse({ results });

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: toValidationMessage(error) }, { status: 400 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "JSON形式が不正です。" }, { status: 400 });
    }

    return NextResponse.json({ message: "比較リクエストの処理中にエラーが発生しました。" }, { status: 500 });
  }
}
