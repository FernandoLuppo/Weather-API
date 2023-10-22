import sequelize, { Model } from "sequelize"
import db from "."
import type { UUID } from "crypto"
import { User } from "./User"

export class Token extends Model {
  declare id: UUID
  declare token: string
  declare userToken: string
}

Token.init(
  {
    id: {
      type: sequelize.UUIDV4,
      autoIncrement: false,
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
    }
  },
  {
    sequelize: db,
    tableName: "Token",
    underscored: true
  }
)

Token.belongsTo(User, {
  foreignKey: "userToken",
  as: "user"
})
