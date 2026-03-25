# AI大学HUB

AI大学の視聴者向けに、AIを「試せる・学べる・触れられる」体験を集約したオープンサイトです。  
`template` の技術スタックと構成方針を踏襲し、機能を拡張しやすい構造で実装しています。

## 技術スタック
- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- PostgreSQL
- Drizzle ORM / Drizzle Kit
- Zod
- Playwright（e2e）
- Azure Container Apps（デプロイ先想定）

## ディレクトリ構成
```txt
src/
  app/         # 画面 / Route Handlers
  components/  # 共通 UI
  features/    # 機能単位の実装（API, trials, insights など）
  lib/         # 共通関数（env validation など）
  db/          # DB 接続 / schema
  types/       # 型定義
drizzle/       # 生成される migration 出力先
tests/e2e/     # Playwright e2e
```

## セットアップ
1. 依存関係をインストール
```bash
npm install
```

2. 環境変数を作成
```bash
cp .env.example .env.local
```

3. 必要に応じて `DATABASE_URL` などを更新

4. 開発サーバーを起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## LLM/モデル比較ページの設定
- `/apis/gpt-text-lab` は「LLM/モデル 比較」ページとして動作します。
- `LLM_COMPARE_USE_MOCK=true` のときだけモック応答を返します（`.env.example` は `false`）。
- 実APIを使う場合は `LLM_COMPARE_USE_MOCK=false` にして、以下のキーを設定してください。
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `GOOGLE_GENERATIVE_AI_API_KEY`
- 1リクエストあたりのタイムアウトは `LLM_COMPARE_TIMEOUT_MS` で調整できます。
- 部分失敗の検証用に `LLM_COMPARE_MOCK_FAIL_MODELS=provider:model` を指定できます。
- モデル定義は `src/features/apis/llm-compare/catalog.ts` で管理し、モデルごとに以下パラメータを切り替えています。
  - OpenAI: `reasoning.effort`, `text.verbosity`, `max_output_tokens`（Responses API）
  - Claude: `max_tokens`, `temperature`
  - Gemini: `generationConfig.maxOutputTokens`, `temperature`, `topP`, `topK`

## 立ち上げ方（ローカル）
最短で立ち上げる場合は以下の順番です。

1. PostgreSQL を起動（ローカル or Docker）
2. `.env` の `DATABASE_URL` を接続先に合わせる
3. 初回のみマイグレーション適用
```bash
npm run db:migrate
```
4. アプリ起動
```bash
npm run dev
```

## DB 更新手順（Drizzle）
スキーマ変更時は、毎回この手順で更新します。

1. `src/db/schema.ts` を編集
2. マイグレーション SQL を生成
```bash
npm run db:generate
```
3. DB に適用
```bash
npm run db:migrate
```
4. 必要に応じて Drizzle Studio で確認
```bash
npm run db:studio
```

## DB 関連コマンド
```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## 品質確認コマンド
```bash
npm run lint
npm run build
npm run test:e2e
```

## Azure Container Apps デプロイ方針
- `next.config.ts` で `output: "standalone"` を有効化済み
- ルートの `Dockerfile` は Azure Container Apps で利用しやすい multi-stage 構成
- 実運用時は Azure 側で環境変数（`DATABASE_URL`, `AUTH_SECRET` など）を設定

## 認証の拡張ポイント
- Auth.js 実装を `src/features/auth` に集約する想定
- 事前に `AUTH_URL`, `AUTH_SECRET` を `.env` / Azure の設定へ追加可能
