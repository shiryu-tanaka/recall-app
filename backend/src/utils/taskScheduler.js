const { Task } = require('../models');

// タスクのスケジュールを計算（1日後、3日後、1週間後、2週間後、1ヶ月後）
const calculateTaskDates = () => {
  const now = new Date();
  
  return [
    new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1日後
    new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3日後
    new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1週間後
    new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2週間後
    new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 1ヶ月後
  ];
};

// 問題作成時に自動でタスクを生成
const createTasksForQuestion = async (questionId, userId) => {
  try {
    const taskDates = calculateTaskDates();
    
    const tasks = taskDates.map((dueDate) => ({
      questionId,
      userId,
      dueDate,
      completed: false,
    }));

    await Task.bulkCreate(tasks);
    
    return tasks;
  } catch (error) {
    console.error('Error creating tasks:', error);
    throw error;
  }
};

module.exports = {
  createTasksForQuestion,
};
