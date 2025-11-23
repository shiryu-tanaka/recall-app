const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ユーザー登録
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // バリデーション
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'すべてのフィールドを入力してくださフィールドを入力してください' });
        }

        // 既存ユーザーの確認
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'このメールアドレスは既に登録されています' });
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // ユーザーの作成
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // JWTトークン生成
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'ユーザー登録が完了しました',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};

// ユーザーログイン
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // バリデーション
        if (!email || !password) {
            return res.status(400).json({ message: ' メールアドレスとパスワードを入力してくださパスワードを入力してください' });
        }

        // ユーザーの存在確認
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
        }

        // パスワードの確認
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
        }

        // JWTトークン生成
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'ログインに成功しました',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};

// 現在のユーザー情報取得
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email'],
        });

        if (!user) {
            return res.status(404).json({ message: 'ユーザーが見つかりません' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
