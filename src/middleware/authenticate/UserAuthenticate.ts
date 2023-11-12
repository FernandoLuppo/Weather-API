import {
  loginAuthenticateSchema,
  registerAuthenticateSchema,
  updateInfosAuthenticateSchema
} from "./authenticateSchema"
import type { NextFunction, Request, Response } from "express"
import type * as yup from "yup"

export class UserAuthenticate {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = { error: [""], isError: false, content: "" }

    try {
      await registerAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors
      res.status(401).send(result)
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = { error: [""], isError: false, content: "" }

    try {
      await loginAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors
      res.status(401).send(result)
    }
  }

  public async updateInfos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = { error: [""], isError: false, content: "" }

    try {
      await updateInfosAuthenticateSchema.validate(req.body, {
        abortEarly: false
      })

      next()
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors
      res.status(401).send(result)
    }
  }
}
