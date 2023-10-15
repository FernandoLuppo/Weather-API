import type { Options } from "sequelize"
import * as dotenv from "dotenv"
dotenv.config()

const { DB_USER, DB_NAME, DB_PASSWORD, DB_HOST } = process.env

if (
  DB_USER === undefined &&
  DB_NAME === undefined &&
  DB_PASSWORD === undefined &&
  DB_HOST === undefined
) {
  console.log("process.env is undefined")
}

const config: Options = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: "mysql"
}

export = config
