import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRouter, recoverPasswordRouter, weatherRouter } from "./routes"

import * as dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: true,
    credentials: true
  })
)

app.use(cookieParser())

app.use("/user", userRouter)
app.use("/recover-password", recoverPasswordRouter)
app.use("/weather", weatherRouter)

export { app }
