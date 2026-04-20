# サカナイン公式サイト（Futuristic Game Streamer Website）

VTuber／ストリーマー「サカナイン」向けの公式 Web サイトです。Figma のデザインをベースにしています。

<img width="1920" height="911" alt="image" src="https://github.com/user-attachments/assets/6b9245ab-7e22-4941-92e0-53b32cc57e5e" />

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
| `VITE_USE_DUMMY_ACTIVITY_THUMBS` | 任意 | **未設定ならオン**（ダミー画像を使う）。`false` / `0` / `no` でオフ。`true` / `1` / `yes` で明示オン。Preview で env がビルドに乗らない場合でも未設定ならダミーが出ます。 |

**Cloudflare Pages**: 変数は **ビルド時** にクライアントへ埋め込まれます。**Production** と **Preview** は別設定のため、プレビュー URL 用のデプロイでも同じ `VITE_*` を登録してください。ダッシュボードでは **変数名は `VITE_YOUTUBE` のようにキーだけ**（値は別列）。`VITE_YOUTUBE=UC...` のように名前欄に書くと無効になります。`VITE_TWITCH` がビルドに含まれない場合でも、コード側で既定チャンネル名にフォールバックします（`src/app/config/socialUrls.ts`）。

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

このプロジェクトは **静的サイト（SPA）** としてビルドできるため、**Cloudflare Pages** にそのまま載せられます。代表的な 2 通り（**Git 連携** と **Wrangler CLI**）を以下にまとめます。

### リポジトリ側の前提（Pages 用）

| 内容 | 説明 |
|------|------|
| **`wrangler.toml`** | ルートにあります。`pages_build_output_dir = "./dist"` とプロジェクト名・互換日付を定義しています。[Pages と Wrangler の設定](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)に沿った最小構成です。 |
| **`package.json` の `packageManager`** | `pnpm` のバージョンを固定しています。Pages のビルドが Corepack 経由で同じ pnpm を使いやすくなります。 |
| **ルートは単一パッケージ** | モノレポ用の `pnpm-workspace.yaml` は置いていません（Pages のビルドがワークスペース扱いするトラブルを避けるため）。 |

**静的ファイルのサイズ**: Cloudflare Pages は **デプロイする各ファイルが最大 25 MiB** です。`dist` に含まれる動画・画像（Vite が `src/app/assets` からバンドルするものや `public/` のコピーも含む）がこれを超えると、アップロード検証で失敗します。巨大な動画は再エンコードするか、R2 等の外部ホストに置いて URL だけ参照してください。

Git 連携ではダッシュボードの **ビルドコマンド／出力ディレクトリ** と `wrangler.toml` の内容が一致している必要があります。変更した場合は `wrangler.toml` の `pages_build_output_dir` も合わせてください（先頭スラッシュだけの絶対パス `/dist` は避け、**`dist` または `./dist`** のような相対指定を推奨します）。

### 共通のビルド設定（ダッシュボード）

| 項目 | 値 |
|------|-----|
| ビルドコマンド | `pnpm run build`（`npm run build` でも可だが、`pnpm-lock.yaml` があるため pnpm 推奨） |
| ビルド出力ディレクトリ | `dist` |
| ルートディレクトリ | 空欄（リポジトリのルート） |

**Node のバージョン**は Pages の **Environment variables** などで `NODE_VERSION` に `20` を指定すると、ローカル（README の前提）と揃えやすいです。

`pnpm` が認識されない場合は、ビルドコマンドを次のようにしても構いません（チームの運用に合わせてください）。

```bash
corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm run build
```

`npm` に統一する場合は `package-lock.json` をコミットし、ビルドコマンドを `npm ci && npm run build` などにします。

### クライアントサイドルーティング（重要）

`/about` などを **直接 URL 入力やリロードで開く** と、静的ホスティングでは `index.html` が返らず 404 になることがあります。次のいずれかで対応してください。

1. **Cloudflare Pages の設定**
   **Settings** 周辺で **SPA 向けのフォールバック** を有効にできる場合は有効にする（UI の名称は変わることがあります）。

2. **`public/_redirects`**（Vite は `public/` を `dist/` にコピーします）
   次の 1 行で全パスを `index.html` にフォールバックできます。

   ```
   /*    /index.html   200
   ```

`_redirects` を置いていない場合は、デプロイ後に `/about` などの直アクセスを必ず確認してください。

### 方法 1: Cloudflare Pages（Git 連携）— 推奨

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) にログインします。
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** を選びます（[Git 連携の手順](https://developers.cloudflare.com/pages/get-started/git-integration/)）。
3. リポジトリと本番ブランチ（例: `main`）を選択します。
4. ビルド設定に、上記の **ビルドコマンド** と **出力ディレクトリ `dist`** を入力します。**Root directory** は空のまま（サブディレクトリにプロジェクトが無い場合）です。
5. **Variables and Secrets** に、本番用の `VITE_*` をすべて登録します。機密は **Encrypt** 可能な項目へ（ダッシュボードの案内に従ってください）。
6. 保存してデプロイします。以降、対象ブランチへのプッシュでビルドが走ります。

**ダッシュボードの設定をローカルの `wrangler.toml` に落とし込みたい場合**は、認証済みの環境で次を実行し、生成された内容をコミット前に確認してください。

```bash
npx wrangler pages download config <Pages のプロジェクト名>
```

**注意**: 環境変数を変えたあとは、変更が反映されるまで **再デプロイ** が必要な場合があります。

### 方法 2: Wrangler CLI（手動アップロード）

ローカルでビルドした `dist` を Pages に載せる方法です。

1. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) を用意します（`npm install -g wrangler` または `npx wrangler`）。
2. ログインします。

   ```bash
   npx wrangler login
   ```

3. 初回のみ、Pages プロジェクトを作成します。名前は **`wrangler.toml` の `name`** と揃えると管理しやすいです。

   ```bash
   npx wrangler pages project create <プロジェクト名>
   ```

4. ビルドします。

   ```bash
   pnpm run build
   ```

5. デプロイします。

   ```bash
   npx wrangler pages deploy dist --project-name=<プロジェクト名>
   ```

プレビュー／本番の切り替えは [Wrangler のドキュメント](https://developers.cloudflare.com/workers/wrangler/)およびダッシュボードの **Deployments** から行えます。

### デプロイが失敗するとき（参考）

- ログが **依存インストールより前**で `internal error` になる場合、しばらく待って再試行するか、[サポート](https://cfl.re/3WgEyrH)にビルド ID を添えて問い合わせてください。
- **ビルド出力ディレクトリ**が `dist` と一致しているか、`wrangler.toml` の `pages_build_output_dir` と矛盾していないか確認してください。
- 環境変数名は `VITE_` プレフィックス付きで、アプリ側（`src/vite-env.d.ts` など）と一致させてください。

### デプロイ後の確認

- トップページが表示されること
- `/about`、`/privacy` など各パスを **アドレスバーに直接入力** しても表示されること（SPA フォールバック）
- YouTube / Twitch のアクティビティが期待どおりか（API キー・トークン・CORS／リファラー制限）
- フッターのメール・Discord リンクが本番の `VITE_*` の内容どおりか

## TODO

- 3Dを変える
- ヘッダー
  - メニューの文字が輝くようにする
- フッター
  - DISCORDの位置を変える
  - SNSのボタンを大きくする
- TOP画面
　- Twitchの最新情報を取得する
　- Xの最新情報を取得する
- ABOUT画面
  - ハイライトを2か所変える。
- Schedule画面
  - Twitchから取得する
- Contact画面
  - 送信先を設定する
