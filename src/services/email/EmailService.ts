import type { IResult } from "../../types"
import nodemailer from "nodemailer"
import { handleCatchErrors } from "../../utils"
import { recoverPasswordTemplate } from "./template"

export class EmailService {
  public async recoverPassword(
    recipientEmail: string,
    recipientName: string,
    code: number
  ): Promise<IResult> {
    const result = { content: {}, isError: false, error: [""] }
    const { content, error, isError } = this._emailConfig()

    if (isError) {
      result.isError = isError
      result.error = error
      return result
    }

    const template = recoverPasswordTemplate(
      content.EMAIL_ADMIN,
      recipientEmail,
      recipientName,
      code
    )

    try {
      await content.transporter.sendMail(template)

      result.content = { message: "Email successfully send." }
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  private _emailConfig(): IResult {
    const result = { content: {}, isError: false, error: [""] }
    const { EMAIL_ADMIN, EMAIL_PASSWORD } = process.env

    if (EMAIL_ADMIN === undefined || EMAIL_PASSWORD === undefined) {
      result.isError = true
      result.error = ["Undefined environment variables"]
      return result
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      auth: {
        user: EMAIL_ADMIN,
        pass: EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    result.content = { EMAIL_ADMIN, transporter }
    return result
  }
}
