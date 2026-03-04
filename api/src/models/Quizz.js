"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quizz extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      this.hasMany(models.Question, {
        foreignKey: "quizzId",
        as: "questions",
      });
    }
  }
  Quizz.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Quizz",
      tableName: "quizz",
    },
  );
  return Quizz;
};
