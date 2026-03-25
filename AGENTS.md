# AGENTS

このリポジトリで AI エージェントが実装する際のルールを定義します。

## 技術方針
- フロントエンドは Next.js App Router を使用し、画面と Route Handler は `src/app` に配置する。
- 共通 UI は `src/components`、機能単位の実装は `src/features` に配置する。
- DB まわりは `src/db` に集約し、ORM は Drizzle を使う。
- 入出力の検証は Zod を使い、`src/lib` で共通化する。
- 型定義は `src/types` に置き、`any` は使わない。

## 実装ルール
- 変更は最小単位で行い、関係ないファイルは触らない。
- 新規実装では `@/` エイリアス（`src` 起点）を使う。
- DB アクセスは `src/db/client.ts` 経由に統一する。
- 環境変数は必ず `.env.example` を更新し、命名は分かりやすくする。
- 認証実装は `src/features/auth` に集約し、Auth.js の設定は分散させない。

## 品質ルール
- 実装後は `npm run lint` と `npm run build` を実行する。
- 新しい設定や手順を追加したら `README.md` を更新する。
- 破壊的変更を避け、既存挙動を維持する。
