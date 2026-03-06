'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Quiz extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
            this.hasMany(models.Question, {
                foreignKey: 'quizId',
                as: 'questions',
            });
        }
    }

    Quiz.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'User', key: 'id' },
            },
            title: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT, allowNull: true },
            code: { type: DataTypes.STRING, allowNull: false, unique: true },
        },
        {
            sequelize,
            modelName: 'Quiz',
            tableName: 'quiz'
        },
    );

    return Quiz;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizMinimal:
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
 *           example: Quiz Voltaire
 *         description:
 *           type: string
 *           example: Révision vie de Voltaire
 *         code:
 *           type: string
 *           example: ABCDEF
 *         createAt:
 *           type: string
 *           example: 2026-01-01T00:00:00.000Z
 *         updateAt:
 *           type: string
 *           example: 2026-01-01T00:00:00.000Z
 *     QuizFull:
 *       allOf:
 *         - $ref: '#/components/schemas/QuizMinimal'
 *         - type: object
 *           properties:
 *             questions:
 *               type: array
 *               items: { $ref: '#/components/schemas/Question' }
 */
