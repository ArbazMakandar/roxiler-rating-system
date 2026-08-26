const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("ADMIN", "USER", "STORE_OWNER"),
            allowNull: false
        }
    },
    {
        tableName: "users",
        timestamps: true
    }
);

module.exports = User;

const Rating = require("./Rating");
const Store = require("./Store");

User.hasMany(Rating, {
    foreignKey: "userId",
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
});

User.hasOne(Store, {
    foreignKey: "ownerId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
});
