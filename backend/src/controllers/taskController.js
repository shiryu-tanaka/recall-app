const { Task, Question, Category } = require('../models');
const { Op } = require('sequelize');

// 今日のタスクを取得
exports.getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        completed: false,
        dueDate: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
      include: [
        {
          model: Question,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 週間のタスクを取得
exports.getWeeklyTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        completed: false,
        dueDate: {
          [Op.gte]: today,
          [Op.lt]: nextWeek,
        },
      },
      include: [
        {
          model: Question,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get weekly tasks error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 全タスクを取得
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Question,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// タスク詳細を取得
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Question,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// タスクを完了する
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }

    task.completed = true;
    task.completedAt = new Date();
    await task.save();

    res.json({
      message: 'タスクを完了しました',
      task,
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};
