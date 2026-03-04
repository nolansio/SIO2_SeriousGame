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

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizzMinimal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Quizz Voltaire
 *         description:
 *           type: string
 *           example: Résision vie de Voltaire
 *         code:
 *           type: string
 *           example: ABCDEF
 *         createAt:
 *           type: string
 *           example: 2026-01-01T00:00:00.000Z
 *         updateAt:
 *           type: string
 *           example: 2026-01-01T00:00:00.000Z
 *     QuizzFull:
 *       allOf:
 *         - $ref: '#/components/schemas/QuizzMinimal'
 *         - type: object
 *           properties:
 *             questions:
 *               type: array
 *               items: { $ref: '#/components/schemas/Question' }
 */
