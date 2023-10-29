import {
  loginAuthenticateSchema,
  registerAuthenticateSchema
} from "./authenticateSchema"
import type { NextFunction, Request, Response } from "express"
import type * as yup from "yup"

export class UserAuthenticate {
  public constructor(
    private readonly _request: Request,
    private readonly _response: Response,
    private readonly _next: NextFunction
  ) {}

  public async register(): Promise<void> {
    const result = { error: [""], isError: false, content: "" }

    try {
      await registerAuthenticateSchema.validate(this._request.body, {
        abortEarly: false
      })

      this._next()
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors
      this._response.status(401).send(result)
    }
  }

  public async login(): Promise<void> {
    const result = { error: [""], isError: false, content: "" }

    try {
      await loginAuthenticateSchema.validate(this._request.body, {
        abortEarly: false
      })

      this._next()
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors
      this._response.status(401).send(result)
    }
  }
}
