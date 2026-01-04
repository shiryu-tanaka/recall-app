const { Question, Category } = require('../models');
const { createTasksForQuestion } = require('../utils/taskScheduler');

// 問題一覧取得
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 問題詳細取得
exports.getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ message: '問題が見つかりません' });
    }

    res.json({ question });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 問題作成
exports.createQuestion = async (req, res) => {
  try {
    const { question, answer, explanation, categoryId } = req.body;

    // バリデーション
    if (!question || !answer) {
      return res.status(400).json({ message: '問題と回答は必須です' });
    }

    // 問題を作成
    const newQuestion = await Question.create({
      question,
      answer,
      explanation: explanation || null,
      categoryId: categoryId || null,
      userId: req.user.id,
    });

    // 自動でタスクを生成
    await createTasksForQuestion(newQuestion.id, req.user.id);

    res.status(201).json({
      message: '問題を作成しました',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 問題更新
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, explanation, categoryId } = req.body;

    // バリデーション
    if (!question || !answer) {
      return res.status(400).json({ message: '問題と回答は必須です' });
    }

    const existingQuestion = await Question.findOne({
      where: { id, userId: req.user.id },
    });

    if (!existingQuestion) {
      return res.status(404).json({ message: '問題が見つかりません' });
    }

    // 更新
    existingQuestion.question = question;
    existingQuestion.answer = answer;
    existingQuestion.explanation = explanation || null;
    existingQuestion.categoryId = categoryId || null;
    await existingQuestion.save();

    res.json({
      message: '問題を更新しました',
      question: existingQuestion,
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 問題削除
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { Task } = require('../models'); // Taskモデルをインポート

    const question = await Question.findOne({
      where: { id, userId: req.user.id },
    });

    if (!question) {
      return res.status(404).json({ message: '問題が見つかりません' });
    }

    // 関連するタスクを先に削除
    await Task.destroy({
      where: { questionId: id },
    });

    // 問題を削除
    await question.destroy();

    res.json({ message: '問題を削除しました' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};
