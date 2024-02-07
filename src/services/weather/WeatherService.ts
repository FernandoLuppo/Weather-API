import type { Request } from "express"
import type { IResult } from "../../types"
import type * as yup from "yup"
import { weatherAuthenticateSchema } from "../../middleware"
import {
  handleCatchErrors,
  handleYupErrors,
  selectUnsplashImage
} from "../../utils"
import axios from "axios"

interface IndependentUrl {
  city: string
  weatherKey: string
  unsplashKey: string
}

interface DependentsUrl {
  country: string | null
}

export class WeatherService {
  constructor(private readonly _req: Request) {}

  public async searchCity(city: string): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: "" }
    const { WEATHER_API_KEY, UNSPLASH_API_KEY } = process.env

    const validationCity = await this._validationCity()
    if (validationCity.isError) return validationCity

    const mountingIndependentUrl = this._mountingIndependentUrl({
      city,
      weatherKey: WEATHER_API_KEY as string,
      unsplashKey: UNSPLASH_API_KEY as string
    })

    try {
      const weatherResult = await axios.post(
        mountingIndependentUrl.content.weatherUrl
      )
      const unsplashResult = await axios.get(
        mountingIndependentUrl.content.unsplashUrl
      )
      const { imgFull, imgSmall } = selectUnsplashImage(
        unsplashResult.data.results
      )

      const mountingDependentsUrl = this._mountingDependentsUrl({
        country: weatherResult.data.sys.country
      })

      result.content = {
        weatherAPI: weatherResult.data,
        unsplash: { imgFull, imgSmall },
        flags: mountingDependentsUrl.content.flagUrl
      }
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  private _mountingIndependentUrl({
    city,
    weatherKey,
    unsplashKey
  }: IndependentUrl): IResult {
    const result: IResult = { error: [""], isError: false, content: "" }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashKey}`

    result.content = { weatherUrl, unsplashUrl }
    return result
  }

  private _mountingDependentsUrl({ country }: DependentsUrl): IResult {
    const result: IResult = { error: [""], isError: false, content: "" }

    const flagUrl = `https://flagsapi.com/${country}/shiny/64.png`

    result.content = { flagUrl }
    return result
  }

  private async _validationCity(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: "" }

    try {
      await weatherAuthenticateSchema.validate(this._req.body, {
        abortEarly: false
      })

      this._req.body.city.toLowerCase()
      result.content = this._req.body
      return result
    } catch (error) {
      return handleYupErrors(error as yup.ValidationError)
    }
  }
}
