import sequelize, { type CreationOptional, Model } from "sequelize"
import db from "."
import type { UUID } from "crypto"
import { User } from "./User"

export class Token extends Model {
  declare id: UUID
  declare token: string
  declare userToken: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Token.init(
  {
    id: {
      type: sequelize.UUID,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: sequelize.STRING,
      allowNull: false
    },
    userToken: {
      type: sequelize.STRING,
      allowNull: false
    },
    expireDate: {
      type: sequelize.DATE,
      allowNull: false
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
    tableName: "Token",
    underscored: true,
    timestamps: true
  }
)

User.belongsTo(Token, {
  foreignKey: "userToken",
  as: "token"
})

Token.belongsTo(User, {
  foreignKey: "userToken",
  as: "user"
})
