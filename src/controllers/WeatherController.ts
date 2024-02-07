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

    if (this._req.result?.hasNewCookies)
      return this._res
        .status(200)
        .cookie("accessToken", this._req?.result?.content.accessToken, {
          maxAge: 3.6e6,
          httpOnly: false,
          sameSite: "lax"
        })
        .cookie("refreshToken", this._req?.result?.content.refreshToken, {
          maxAge: 2.592e8,
          httpOnly: false,
          sameSite: "lax"
        })
        .send({ content, error, isError })

    return this._res.status(200).send({ content, error, isError })
  }
}
