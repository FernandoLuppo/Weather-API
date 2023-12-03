import type { Request } from "express"
import type { EmailService } from "../email/EmailService"
import type { IResult } from "../../types"
import {
  checkEmailAuthenticateSchema,
  newPasswordAuthenticateSchema
} from "../../middleware"
import { codeGenerator, handleCatchErrors, handleYupErrors } from "../../utils"
import type * as yup from "yup"
import { User } from "../../database/models/User"
import type { CreateAuthTokenService } from "../token/CreateAuthTokenService"

export class RecoverPasswordService {
  constructor(private readonly _req: Request) {}

  public async checkEmail(
    createAuthTokenService: CreateAuthTokenService,
    emailService: EmailService
  ): Promise<IResult> {
    let result: IResult = { content: {}, isError: false, error: [""] }
    const { content, isError, error } = await this._validationCheckEmail()

    if (isError) {
      result.isError = isError
      result.error = error
      return result
    }

    const code = codeGenerator()
    const user = await User.findOne({ where: { email: content.email } })
    try {
      if (!user) {
        result.isError = true
        result.error = ["Email not find."]
        return result
      }

      const recoverPassword = await emailService.recoverPassword(
        user.email,
        user.name,
        code
      )

      if (recoverPassword.isError) {
        result = recoverPassword
        return result
      }

      const { content, isError, error } =
        await createAuthTokenService.createEmailToken({
          payload: code,
          subject: user.email,
          emailTokenTime: "3m",
          message: "Email token was created with success"
        })

      if (isError) {
        result.isError = isError
        result.error = error
        return result
      }

      result.content = {
        code,
        emailToken: content.emailToken,
        message: content.message
      }
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async newPassword(): Promise<IResult> {
    let result: IResult = { content: {}, isError: false, error: [""] }
    const { subject } = this._req.user as { subject: string }
    const { password } = this._req.body

    const validateNewPassword = await this._validateNewPassword()

    if (validateNewPassword.isError) {
      result = validateNewPassword
      return result
    }

    const user = await User.findOne({ where: { subject } })

    try {
      if (!user) {
        result.isError = true
        result.error = ["Invalid Token."]
        return result
      }

      user.password = password
      await user.save()

      result.content = { message: "Update user password." }
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  private async _validationCheckEmail(): Promise<IResult> {
    const result: IResult = { content: {}, isError: false, error: [""] }

    try {
      await checkEmailAuthenticateSchema.validate(this._req.body, {
        abortEarly: false
      })

      result.content = this._req.body
      return result
    } catch (error) {
      return handleYupErrors(error as yup.ValidationError)
    }
  }

  private async _validateNewPassword(): Promise<IResult> {
    const result: IResult = { content: {}, isError: false, error: [""] }

    const { payload } = this._req.user as { payload: any }

    const { code } = this._req.body

    if (code !== payload) {
      result.isError = true
      result.error = ["Code is incorrect."]
      return result
    }

    try {
      await newPasswordAuthenticateSchema.validate(this._req.body, {
        abortEarly: false
      })

      return result
    } catch (error) {
      return handleYupErrors(error as yup.ValidationError)
    }
  }
}
