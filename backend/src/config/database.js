const { Sequelize } = require('sequelize');
const path = require('path');

// 環境変数によってデータベースを入れ替える
const sequelize = process.env.DATABASE_URL
  ?
    new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false    
    })
  :
    new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database.sqlite'),
      logging: false,
    });

module.exports = sequelize;
