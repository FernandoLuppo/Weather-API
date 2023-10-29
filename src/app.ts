import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import * as dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

app.use(cors({ credentials: true, origin: true }))
app.use(cookieParser())

export { app }
