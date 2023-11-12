import sequelize, { type CreationOptional, Model } from "sequelize"
import db from "."
import type { UUID } from "crypto"

export class User extends Model {
  declare id: UUID
  declare name: string
  declare email: string
  declare password: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

User.init(
  {
    id: {
      type: sequelize.UUID,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: sequelize.STRING,
      allowNull: false
    },
    email: {
      type: sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: sequelize.STRING,
      allowNull: false
    },
    profileImage: {
      type: sequelize.STRING,
      defaultValue: "assets/icons/user-icon.svg"
    },
    createdAt: {
      type: sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: sequelize.DATE,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: "user",
    underscored: true,
    timestamps: true
  }
)
