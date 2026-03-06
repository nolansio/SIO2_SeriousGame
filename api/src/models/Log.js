'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Log extends Model {
        static associate(models) {
            // Rien
        }
    }

    Log.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
        },
        {
            sequelize,
            modelName: 'Log',
            tableName: 'log',
            timestamps: true,
            updatedAt: false
        },
    );

    return Log;
};
