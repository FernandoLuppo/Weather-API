import { Router } from "express"
import type { Request, Response } from "express"
import { TokenAuthenticate, WeatherAuthenticate } from "../middleware"
import { WeatherController } from "../controllers"
import { WeatherService } from "../services"

const weatherRouter = Router()
const weatherAuthenticate = new WeatherAuthenticate()
const tokenAuthenticate = new TokenAuthenticate()

weatherRouter.post(
  "/location",
  tokenAuthenticate.validate,
  weatherAuthenticate.location,
  async (req: Request, res: Response) => {
    const weatherService = new WeatherService(req)
    await new WeatherController(req, res, weatherService).getLocation()
  }
)

export { weatherRouter }
