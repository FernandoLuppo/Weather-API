import type { Request } from "express"
import type * as yup from "yup"
import type { IResult } from "../../types"
import {
  loginAuthenticateSchema,
  registerAuthenticateSchema
} from "../../middleware"
import { User } from "../../database/models/User"
import { v4 as uuidv4 } from "uuid"
import { handleCatchErrors } from "../../utils"

export class UserService {
  public constructor(private readonly _req: Request) {}

  public getInfos(): void {}

  public updateInfos(): void {}

  public deleteUser(): void {}

  public async register(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { name, email, password } = this._req.body
    const { error, isError } = await this._registerValidation()
    const id = uuidv4()

    if (isError) {
      result.error = error
      result.isError = isError
      return result
    }

    try {
      await User.create({ id, name, email, password })
      result.content = { message: "User create with success!" }

      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public login(): void {}

  private async _registerValidation(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: "" }

    try {
      await registerAuthenticateSchema.validate(this._req.body, {
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

  private async _loginValidation(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: "" }

    try {
      await loginAuthenticateSchema.validate(this._req.body, {
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
