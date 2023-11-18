import type { Request } from "express"
import type * as yup from "yup"
import type { IResult } from "../../types"
import {
  loginAuthenticateSchema,
  registerAuthenticateSchema,
  updateInfosAuthenticateSchema
} from "../../middleware"
import { User } from "../../database/models/User"
import { Token } from "../../database/models/Token"
import { v4 as uuidv4 } from "uuid"
import { handleCatchErrors, handleYupErrors } from "../../utils"
import type { TokenService } from "../"
import dayjs from "dayjs"
import { EncryptPasswordService } from "../"

export class UserService {
  public constructor(private readonly _req: Request) {}

  public async getInfos(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const id = this._req.user?.id

    try {
      const user = await User.findOne({ where: { id } })

      if (user !== null) {
        result.content = {
          name: user?.name,
          email: user?.email,
          userProfile: user?.dataValues.profileImage
        }
        return result
      }

      result.error = ["User not found."]
      result.isError = true
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async updateInfos(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { content, error, isError } = await this._updateInfosValidation()
    const id = this._req.user?.id

    if (isError) {
      result.error = error
      result.isError = isError
      return result
    }

    try {
      const user = await User.findOne({ where: { id } })
      if (user !== null) {
        user.name = content.name
        user.email = content.email
        user.dataValues.profileImage = content.profileImage
        await user.save()

        result.content = {
          name: user?.name,
          email: user?.email,
          profileImage: user.dataValues.profileImage
        }
        return result
      }

      result.isError = true
      result.error = ["User not found."]
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async register(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { content, error, isError } = await this._registerValidation()
    const id = uuidv4()

    if (isError) {
      result.error = error
      result.isError = isError
      return result
    }

    const encryptPassword = new EncryptPasswordService(content.password)
    const newPassword = encryptPassword.encrypt()

    if (newPassword.isError) {
      result.error = newPassword.error
      result.isError = newPassword.isError
      return result
    }

    try {
      await User.create({
        id,
        name: content.name,
        email: content.email,
        password: newPassword.content
      })
      result.content = { message: "User create with success!" }

      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async login(tokenService: TokenService): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { error, isError, content } = await this._loginValidation()
    const id = uuidv4()

    if (isError) {
      result.isError = isError
      result.error = error
      return result
    }

    try {
      const accessToken = tokenService.createToken(content.id, "60m")
      const refreshToken = tokenService.createToken(content.id, "3d")
      const refreshTokenExpiresDate = dayjs().add(3, "days").toDate()

      const token = await Token.findOne({ where: { userToken: content.id } })

      if (token !== null) {
        token.userToken = content.id
        token.token = refreshToken.content
        token.dataValues.expireDate = refreshTokenExpiresDate
        await token.save()

        result.content = {
          accessToken,
          refreshToken,
          message: "User logged with success!"
        }
        return result
      }

      await Token.create({
        id,
        userToken: content.id,
        token: refreshToken.content,
        expireDate: refreshTokenExpiresDate
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

  public async deleteUser(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const id = this._req.user?.id

    try {
      const user = await User.findOne({ where: { id } })
      await user?.destroy()

      result.content = { message: "User deleted." }
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  private async _updateInfosValidation(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: "" }

    try {
      await updateInfosAuthenticateSchema.validate(this._req.body, {
        abortEarly: false
      })

      result.content = this._req.body
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

      result.content = this._req.body
      return result
    } catch (err) {
      return handleYupErrors(err as yup.ValidationError)
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
      return handleYupErrors(err as yup.ValidationError)
    }
  }
}
