const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Question = require('./Question');
const Task = require('./Task');

// リレーションシップの定義
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Question, { foreignKey: 'userId', onDelete: 'CASCADE' });
Question.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Question, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Question.belongsTo(Category, { foreignKey: 'categoryId' });

Question.hasMany(Task, { foreignKey: 'questionId', onDelete: 'CASCADE' });
Task.belongsTo(Question, { foreignKey: 'questionId' });

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// データベース接続テスト
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// データベース同期
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Category,
  Question,
  Task,
  testConnection,
  syncDatabase,
};
