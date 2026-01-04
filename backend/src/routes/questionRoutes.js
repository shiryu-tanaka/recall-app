const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

// すべてのルートで認証が必要
router.use(authMiddleware);

router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
