import type * as yup from 'yup'
import type { Request } from 'express'
import {
  loginAuthenticateSchema,
  registerAuthenticateSchema
} from '../../middleware'
import type { IResult } from '../../types'

export class UserValidation {
  public constructor(private readonly _request: Request) {}

  public async registerDataValidation(): Promise<IResult> {
    const result: IResult = { error: [''], isError: false, data: '' }

    try {
      await registerAuthenticateSchema.validate(this._request.body, {
        abortEarly: false
      })

      return result
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors

      return result
    }
  }

  public async loginDataValidation(): Promise<IResult> {
    const result: IResult = { error: [''], isError: false, data: '' }

    try {
      await loginAuthenticateSchema.validate(this._request.body, {
        abortEarly: false
      })

      return result
    } catch (err) {
      const errors: string[] = []

      ;(err as yup.ValidationError).errors.forEach(error => {
        errors.push(error)
      })

      result.isError = true
      result.error = errors

      return result
    }
  }
}
