import type { NextFunction, Request, Response } from "express"
import type * as yup from "yup"
import { handleYupErrors } from "../../utils"
import { weatherAuthenticateSchema } from "./authenticateSchema"

export class WeatherAuthenticate {
  public async location(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await weatherAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      res.status(401).send(handleYupErrors(err as yup.ValidationError))
    }
  }
}
