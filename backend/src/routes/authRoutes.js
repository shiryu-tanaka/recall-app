const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// 認証不要
router.post('/register', authController.register);
router.post('/login', authController.login);

// 認証必要
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;