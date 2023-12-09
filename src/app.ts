import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {
  userRouter,
  tokenRouter,
  recoverPasswordRouter,
  weatherRouter
} from "./routes"

import * as dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

app.use(cors({ credentials: true, origin: true }))
app.use(cookieParser())

app.use("/user", userRouter)
app.use("/token", tokenRouter)
app.use("/recover-password", recoverPasswordRouter)
app.use("/weather", weatherRouter)

export { app }
