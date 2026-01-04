const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// すべてのルートで認証が必要
router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.get('/today', taskController.getTodayTasks);
router.get('/weekly', taskController.getWeeklyTasks);
router.get('/:id', taskController.getTask);
router.put('/:id/complete', taskController.completeTask);

module.exports = router;
