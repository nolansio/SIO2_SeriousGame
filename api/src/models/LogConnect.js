"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LogConnect extends Model {
    static associate(models) {}
  }
  LogConnect.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "LogConnect",
      tableName: "log_connect",
      timestamps: true,
      updatedAt: false,
    },
  );
  return LogConnect;
};
