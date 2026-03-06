'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            this.belongsTo(models.Quiz, {
                foreignKey: 'quizId',
                as: 'quiz'
            });
        }
    }

    Question.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.TEXT, allowNull: false },
            quizId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Quiz', key: 'id' }
            },
            answer: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
        },
        {
            sequelize,
            modelName: 'Question',
            tableName: 'question'
        },
    );

    return Question;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quizId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Son vrai nom est-il François-Marie Arouet ?
 *         answer:
 *           type: boolean
 *           example: true
 */
