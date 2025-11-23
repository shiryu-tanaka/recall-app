const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const token = authHeader.substring(7); // "Bearer "を除去

    // トークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // リクエストにユーザー情報を追加
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: '無効なトークンです' });
  }
};

module.exports = authMiddleware;