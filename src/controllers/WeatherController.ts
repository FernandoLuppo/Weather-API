import type { Request, Response } from "express"
import type { WeatherService } from "../services"

export class WeatherController {
  constructor(
    private readonly _req: Request,
    private readonly _res: Response,
    private readonly _weatherService: WeatherService
  ) {}

  public async getLocation(): Promise<Response<any, Record<string, any>>> {
    const { content, error, isError } = await this._weatherService.searchCity(
      this._req.body.city
    )

    if (isError) return this._res.status(400).send({ content, error, isError })

    return this._res.status(200).send({ content, error, isError })
  }
}
