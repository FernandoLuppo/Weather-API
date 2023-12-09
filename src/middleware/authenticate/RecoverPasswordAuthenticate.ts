import type { NextFunction, Request, Response } from "express"
import type * as yup from "yup"
import {
  checkEmailAuthenticateSchema,
  newPasswordAuthenticateSchema
} from "./authenticateSchema"
import { handleYupErrors } from "../../utils"

export class RecoverPasswordAuthenticate {
  public async checkEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await checkEmailAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      res.status(401).send(handleYupErrors(err as yup.ValidationError))
    }
  }

  public async newPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await newPasswordAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      res.status(401).send(handleYupErrors(err as yup.ValidationError))
    }
  }
}
