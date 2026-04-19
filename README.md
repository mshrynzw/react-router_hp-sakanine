# サカナイン公式サイト（Futuristic Game Streamer Website）

VTuber／ストリーマー「サカナイン」向けの公式 Web サイトです。Figma のデザインをベースにしています。

## 技術スタック

| 区分 | 採用技術 |
|------|----------|
| フレームワーク | React 18 |
| ビルド | Vite 6 |
| ルーティング | React Router 7（`createBrowserRouter`） |
| スタイル | Tailwind CSS 4（`@tailwindcss/vite`） |
| UI | Radix UI、MUI Icons、Motion など |
| 3D / 演出 | Three.js、カスタム WebGL 背景など |

## 前提条件

- **Node.js** 18 以上（20 LTS 推奨）。Vite 6 の要件に合わせてください。
- パッケージマネージャは **`pnpm` を推奨**（リポジトリに `pnpm-lock.yaml` があります）。`npm` でも動作しますが、ロックファイルが異なるためチーム開発では揃えることをおすすめします。

## セットアップ

リポジトリをクローンしたディレクトリで依存関係をインストールします。

```bash
pnpm install
```

`npm` を使う場合:

```bash
npm install
```

## 環境変数

Vite では `VITE_` で始まる変数だけがクライアントに埋め込まれます。ルートに `.env` を置き（本リポジトリでは各自が作成・管理）、必要なキーを設定してください。**API キーやトークンは Git にコミットしないでください。**

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `VITE_TWITCH` | 推奨 | Twitch のユーザー名（URL 生成などに使用） |
| `VITE_YOUTUBE` | 推奨 | YouTube チャンネル ID |
| `VITE_X` | 任意 | X（旧 Twitter）のハンドル |
| `VITE_DONERU` | 任意 | 投げ銭サービス（どねる）のユーザー名 |
| `VITE_CONTACT_EMAIL` | 任意 | フッター等に表示する連絡用メール |
| `VITE_DISCORD_LINE` | 任意 | Discord サーバーへの招待 URL 等（`https://` で始まるときのみリンク化） |
| `VITE_YOUTUBE_API_KEY` | 任意 | YouTube Data API v3 用（アクティビティ取得）。リファラー制限の設定を推奨 |
| `VITE_TWITCH_CLIENT_ID` | 任意 | Twitch Helix API 用 Client ID |
| `VITE_TWITCH_ACCESS_TOKEN` | 任意 | Twitch Helix 用トークン（Client ID とセット） |
| `VITE_USE_DUMMY_ACTIVITY_THUMBS` | 任意 | `true` または `1` のとき、アクティビティのサムネをダミー画像に固定 |

型定義とコメントは `src/vite-env.d.ts` も参照してください。

## 開発サーバー

```bash
pnpm dev
```

ブラウザで表示される URL（通常は `http://localhost:5173`）を開きます。ファイルを保存するとホットリロードされます。

## 本番ビルド

```bash
pnpm run build
```

成果物は **`dist/`** に出力されます。ローカルで確認する場合:

```bash
pnpm exec vite preview
```

## ルーティング

`src/app/routes.ts` で定義したパスが利用できます。

| パス | 内容 |
|------|------|
| `/` | トップ |
| `/about` | About |
| `/schedule` | スケジュール |
| `/support` | サポート |
| `/contact` | お問い合わせ |
| `/privacy` | プライバシー |

## プロジェクト構成（抜粋）

```
src/
  app/           # ページ・レイアウト・ルート定義
  styles/        # グローバル CSS・テーマ
  main.tsx       # エントリ
public/          # 静的ファイル（ビルド時に dist 直下へコピー）
vite.config.ts
```

---

## Cloudflare へのデプロイ

このプロジェクトは **静的サイト（SPA）** としてビルドできるため、**Cloudflare Pages** にそのまま載せられます。以下では代表的な 2 通り（**Git 連携** と **CLI 手動デプロイ**）を説明します。

### 共通のビルド設定

Cloudflare の「ビルドコマンド」「出力ディレクトリ」は次のとおりです。

| 項目 | 値 |
|------|-----|
| ビルドコマンド | `pnpm run build`（`npm run build` でも可） |
| ビルド出力ディレクトリ | `dist` |
| ルートディレクトリ | リポジトリのルート（`/`）のまま |

`pnpm` を使う場合、Pages のビルド環境で `pnpm` が使えるようにする必要があります。次のいずれかを行うのが一般的です。

- **方法 A**: 環境変数 `NODE_VERSION` を `20` などに設定し、ビルドコマンドの前に corepack を有効化する
  例: `corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm run build`
- **方法 B**: ビルドコマンドを `npm install && npm run build` に統一する（`package-lock.json` をコミットしている場合）

チームの運用に合わせて選んでください。

### クライアントサイドルーティング（重要）

`/about` などを **直接 URL 入力やリロードで開く** と、静的ホスティングでは `index.html` が返らず 404 になることがあります。次のいずれかで対応してください。

1. **Cloudflare Pages の設定**
   プロジェクトの **Settings → Builds & deployments** 周辺で、**Single Page Application（SPA）向けのフォールバック** を有効にできる場合は有効にする（UI は変更されることがあるため、表示名はダッシュボードで確認してください）。

2. **`public/_redirects` を追加する**（Vite は `public/` を `dist/` にコピーします）
   次の 1 行を `public/_redirects` に書くと、すべてのパスを `index.html` にフォールバックできます。

   ```
   /*    /index.html   200
   ```

本リポジトリに `_redirects` が無い場合は、デプロイ後に `/about` 等の直アクセスを必ず確認してください。

### 方法 1: Cloudflare Pages（Git 連携）— 推奨

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) にログインします。
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** を選びます。
3. GitHub / GitLab などを連携し、このリポジトリとブランチ（例: `main`）を選択します。
4. ビルド設定で上記の **ビルドコマンド** と **出力ディレクトリ `dist`** を入力します。
5. **Environment variables（環境変数）** に、本番用の `VITE_*` をすべて登録します。
   - シークレットにしたい値は **Encrypt** 可能な項目に設定します（ダッシュボードの案内に従ってください）。
6. 保存してデプロイします。以降、プッシュのたびにビルドが走ります。

**注意**: 環境変数を変更したあとは、**再デプロイ**が必要な場合があります（ダッシュボードの「Retry deployment」など）。

### 方法 2: Wrangler CLI（手動アップロード）

ローカルでビルドした `dist` をそのまま Pages に載せる方法です。

1. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) をインストールします（`npm install -g wrangler` またはプロジェクトの devDependency として追加）。
2. ログインします。

   ```bash
   npx wrangler login
   ```

3. 初回のみ、Pages プロジェクトを作成します（名前は任意）。

   ```bash
   npx wrangler pages project create <プロジェクト名>
   ```

4. ローカルでビルドします。

   ```bash
   pnpm run build
   ```

5. `dist` をデプロイします。

   ```bash
   npx wrangler pages deploy dist --project-name=<プロジェクト名>
   ```

プレビュー用ブランチや本番用プロダクションの切り替えは、Wrangler のドキュメントおよびダッシュボードの **Deployments** から行えます。

### デプロイ後の確認

- トップページが表示されること
- `/about`、`/privacy` など各パスを **アドレスバーに直接入力** しても表示されること（SPA フォールバック）
- YouTube / Twitch のアクティビティが期待どおりか（API キー・トークン・CORS／リファラー制限）
- フッターのメール・Discord リンクが `.env` の内容どおりか
