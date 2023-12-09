import type { NextFunction, Request, Response } from "express"
import type * as yup from "yup"
import { handleYupErrors } from "../../utils"
import {
  loginAuthenticateSchema,
  registerAuthenticateSchema,
  updateInfosAuthenticateSchema
} from "./authenticateSchema"

export class UserAuthenticate {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await registerAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      res.status(401).send(handleYupErrors(err as yup.ValidationError))
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await loginAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      res.status(401).send(handleYupErrors(err as yup.ValidationError))
    }
  }

  public async updateInfos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await updateInfosAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      res.status(401).send(handleYupErrors(err as yup.ValidationError))
    }
  }
}
