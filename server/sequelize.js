const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('todo_app', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;