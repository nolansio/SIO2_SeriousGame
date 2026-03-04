"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      this.hasMany(models.Quizz, {
        foreignKey: "userId",
        as: "quizzes",
      });
    }
  }
  Question.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      enonce: { type: DataTypes.TEXT, allowNull: false },
      quizzId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Quizz", key: "id" },
      },
      reponse: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "question",
    },
  );
  return Question;
};
