import sequelize, { Model } from "sequelize"
import db from "."

export class User extends Model {
  declare id: string
  declare token: string
  declare userToken: string
}

User.init(
  {
    id: {
      type: sequelize.CHAR(36),
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
