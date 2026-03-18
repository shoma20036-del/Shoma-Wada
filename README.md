# ES 例文ジェネレーター

体験談をSTAR法に沿った自己PR例文に変換するツールです。

## セットアップ

### 1. リポジトリをクローン or ファイルを配置

```bash
cd es-rewriter
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.local.example` をコピーして `.env.local` を作成し、APIキーを設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて編集：
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
```

APIキーは https://console.anthropic.com で取得できます。

### 4. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 にアクセスして確認できます。

---

## Vercelへのデプロイ手順

### 1. GitHubにリポジトリを作成してプッシュ

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/あなたのユーザー名/es-rewriter.git
git push -u origin main
```

### 2. Vercelにデプロイ

1. https://vercel.com にアクセスしてログイン（GitHubアカウントでOK）
2. 「Add New Project」をクリック
3. 作成したGitHubリポジトリを選択
4. 「Environment Variables」に以下を追加：
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-xxxxxxxxxxxxxxxx`（実際のAPIキー）
5. 「Deploy」をクリック

デプロイ完了後、発行されたURLを社内メンバーに共有するだけで利用できます。

---

## 注意事項

- `.env.local` は `.gitignore` に含まれているため、GitHubにAPIキーが漏れることはありません
- Vercelの環境変数はサーバーサイドでのみ使用されるため、フロントエンドに露出しません
- APIの利用料金はAnthropicのコンソールで確認できます（目安：1回の生成あたり約1〜3円）
