import type { Request } from "express"
import type * as yup from "yup"
import type { IResult } from "../../types"
import type { CreateAuthTokenService } from "../token/CreateAuthTokenService"
import {
  loginAuthenticateSchema,
  registerAuthenticateSchema,
  updateInfosAuthenticateSchema
} from "../../middleware"
import { User } from "../../database/models/User"
import { v4 as uuidv4 } from "uuid"
import {
  handleCatchErrors,
  handleRegisterCatchErrors,
  handleYupErrors
} from "../../utils"
import { EncryptPasswordService } from "../"

export class UserService {
  public constructor(private readonly _req: Request) {}

  public async getInfos(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const id = this._req.user?.subject

    try {
      const user = await User.findOne({ where: { id } })

      if (user !== null) {
        result.content = {
          id: user?.id,
          name: user?.name,
          email: user?.email
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
    const id = this._req.user?.subject

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
        user.updatedAt = new Date()
        await user.save()

        result.content = {
          name: user?.name,
          email: user?.email
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
      return handleRegisterCatchErrors(error)
    }
  }

  public async login(
    createAuthTokenService: CreateAuthTokenService
  ): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { content, error, isError } = await this._loginValidation()
    const id = uuidv4()

    if (isError) {
      result.isError = isError
      result.error = error
      return result
    }

    try {
      const createAuthTokens = await createAuthTokenService.createAuthTokens({
        tokenId: id,
        userId: content.id,
        accessTokenTime: "60m",
        refreshTokenTime: "3d",
        message: "User logged with success!"
      })

      if (createAuthTokens.isError) {
        result.isError = true
        result.error = createAuthTokens.error
        return result
      }

      const userInfos = {
        userId: content.id,
        userName: content.name,
        userEmail: content.email
      }

      result.content = { ...createAuthTokens.content, userInfos }

      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async deleteUser(): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const id = this._req.user?.subject

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
      return handleYupErrors(error as yup.ValidationError)
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
    } catch (error) {
      return handleYupErrors(error as yup.ValidationError)
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

      result.content = { id: user.id, name: user.name, email: user.email }
      return result
    } catch (error) {
      return handleYupErrors(error as yup.ValidationError)
    }
  }
}
