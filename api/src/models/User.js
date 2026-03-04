"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Quizz, {
        foreignKey: "userId",
        as: "quizzes",
      });
    }
  }
  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
        defaultValue: "USER",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      timestamps: false,
    },
  );
  return User;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserMinimal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.fr
 *         role:
 *           type: string
 *           example: USER
 *     UserFull:
 *       allOf:
 *         - $ref: '#/components/schemas/UserMinimal'
 *         - type: object
 *           properties:
 *             quizzes:
 *               type: array
 *               items: { $ref: '#/components/schemas/QuizzFull' }
 */
