'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ToDos', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assignee: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};
