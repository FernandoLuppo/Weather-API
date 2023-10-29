import type { Request } from "express"
import type * as yup from "yup"
import type { IResult } from "../../types"
import {
  loginAuthenticateSchema,
  registerAuthenticateSchema
} from "../../middleware"
import { User } from "../../database/models/User"
import { Token } from "../../database/models/Token"
import { v4 as uuidv4 } from "uuid"
import { handleCatchErrors } from "../../utils"
import type { TokenService } from "../Token/TokenService"
import dayjs from "dayjs"
import { EncryptPasswordService } from "../EncryptPassword/EncryptPasswordService"

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

    const encryptPassword = new EncryptPasswordService(password)
    const newPassword = encryptPassword.encrypt()

    if (newPassword.isError) {
      result.error = newPassword.error
      result.isError = newPassword.isError
      return result
    }

    try {
      await User.create({ id, name, email, password: newPassword.content })
      result.content = { message: "User create with success!" }

      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async login(tokenService: TokenService): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { error, isError, content } = await this._loginValidation()

    if (isError) {
      result.isError = isError
      result.error = error
      return result
    }

    try {
      const accessToken = tokenService.createToken(content.id, "60m")
      const refreshToken = tokenService.createToken(content.id, "3d")
      const refreshTokenExpiresDate = dayjs().add(3, "days").toDate()

      await Token.create({
        userToken: content.id,
        token: refreshToken,
        expireDat: refreshTokenExpiresDate
      })

      result.content = {
        accessToken,
        refreshToken,
        message: "User logged with success!"
      }
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

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
    const { email, password } = this._req.body

    try {
      await loginAuthenticateSchema.validate(this._req.body, {
        abortEarly: false
      })

      const user = await User.findOne({ where: { email } })

      if (user === null || user === undefined) {
        return result
      }

      const encryptPassword = new EncryptPasswordService(password)
      const { error, isError } = await encryptPassword.compare(user.password)

      if (isError) {
        result.isError = isError
        result.error = error
        return result
      }

      result.content = { id: user.id }
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
