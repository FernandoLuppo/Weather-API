import sequelize, { Model } from "sequelize"
import db from "."

export class User extends Model {
  declare id: string
  declare name: string
  declare email: string
  declare password: string
}

User.init(
  {
    id: {
      type: sequelize.CHAR(36),
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
    }
  },
  {
    sequelize: db,
    tableName: "user"
  }
)
