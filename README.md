# Recall App - アクティブリコール学習アプリ

間隔反復学習を活用した問題管理・学習支援Webアプリケーション

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-24.x-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## 📖 概要

Recall Appは、アクティブリコール（能動的想起）と間隔反復学習の原理を活用した学習支援アプリケーションです。問題を作成すると自動的に復習スケジュールが組まれ、効率的な長期記憶の定着をサポートします。

### 主な特徴

- 📝 問題の作成・編集・削除
- 🏷️ カテゴリ機能による問題の整理
- ⏰ 自動タスク生成（1日後、3日後、1週間後、2週間後、1ヶ月後）
- 📅 今日のタスク・週間タスクの表示
- ✅ 正解・不正解による進捗管理
- 🔐 ユーザー認証機能

## 🎯 開発の背景

このアプリケーションは、大学の学習効率を向上させるために開発しました。

**開発手法**: Claude（AI）との対話型開発により、段階的に機能を実装しました。

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **React Router** - ルーティング
- **Axios** - HTTP通信
- **Vite** - ビルドツール

### バックエンド
- **Node.js** - サーバーサイドランタイム
- **Express.js** - Webフレームワーク
- **Sequelize** - ORM
- **SQLite** - データベース
- **JWT** - 認証
- **bcryptjs** - パスワードハッシュ化

## 📁 プロジェクト構造
```
recall-app/
├── frontend/          # Reactフロントエンド
│   ├── src/
│   │   ├── components/  # 再利用可能なコンポーネント
│   │   ├── pages/       # ページコンポーネント
│   │   ├── services/    # API通信
│   │   └── App.jsx
│   └── package.json
├── backend/           # Node.js/Expressバックエンド
│   ├── src/
│   │   ├── controllers/  # ビジネスロジック
│   │   ├── models/       # データモデル
│   │   ├── routes/       # ルーティング
│   │   ├── middleware/   # 認証などのミドルウェア
│   │   └── utils/        # ユーティリティ関数
│   └── package.json
└── README.md
```

## 🚀 セットアップ

### 必要環境
- Node.js 18以上
- npm または yarn

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/shiryu-tanaka/recall-app.git
cd recall-app
```

2. 依存関係をインストール
```bash
# ルートディレクトリで
npm install

# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

3. 環境変数の設定

`backend/.env`ファイルを作成：
```env
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. アプリケーションを起動
```bash
# ルートディレクトリから両方同時に起動
cd ..
npm run dev

# または個別に起動
# バックエンド
npm run backend

# フロントエンド
npm run frontend
```

5. ブラウザでアクセス

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3001

## 💡 使い方

1. **アカウント登録**: 新規登録画面でユーザー名、メールアドレス、パスワードを入力
2. **カテゴリ作成**: カテゴリ管理画面で学習分野ごとにカテゴリを作成
3. **問題作成**: 問題作成画面で問題、回答、解説を入力（自動的に5つのタスクが生成されます）
4. **タスク実行**: ダッシュボードで今日のタスクを確認し、問題に解答
5. **進捗管理**: 正解したタスクは完了し、不正解の場合は再度挑戦

## 📊 データベース設計

### 主要テーブル

- **Users**: ユーザー情報
- **Categories**: 問題のカテゴリ
- **Questions**: 問題（質問、回答、解説）
- **Tasks**: 復習タスク（問題とスケジュール）

### 間隔反復スケジュール

問題作成時に以下のスケジュールで自動的にタスクが生成されます：
- 1日後
- 3日後
- 1週間後
- 2週間後
- 1ヶ月後


## 📝 開発プロセス

このプロジェクトは、以下のステップで開発を進めました：

1. **要件定義**: アプリケーションの機能と技術スタックの決定
2. **環境構築**: Git、バックエンド、フロントエンドのセットアップ
3. **データベース設計**: モデル定義とリレーションシップの構築
4. **認証機能**: ユーザー登録・ログイン・JWT認証の実装
5. **カテゴリ管理**: CRUD操作の実装
6. **問題管理**: 問題作成と自動タスク生成
7. **タスク機能**: ダッシュボード表示と完了機能

各ステップでGitHub Issuesを作成し、計画的に開発を進めました。
