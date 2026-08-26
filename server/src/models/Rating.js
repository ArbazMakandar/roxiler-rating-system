const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define(
    "Rating",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "stores",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        }
    },
    {
        tableName: "ratings",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["userId", "storeId"]
            }
        ]
    }
);

module.exports = Rating;

const User = require("./User");
const Store = require("./Store");

Rating.belongsTo(User, {
    foreignKey: "userId",
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
});

Rating.belongsTo(Store, {
    foreignKey: "storeId",
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
});
