import { type CreationOptional, DataTypes, Model } from "sequelize"
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
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expireDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: "Token",
    underscored: true
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
