'use strict';

const {Sequelize, DataTypes} = require('sequelize');

// import schemas
const userSchema = require('./user.schema');
const todoItemSchema = require('./todo.schema');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:memory:');

// create tables
const userTable = userSchema(sequelize, DataTypes);
const todoItemTable = todoItemSchema(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: userTable,
  todoItems: todoItemTable,
};
