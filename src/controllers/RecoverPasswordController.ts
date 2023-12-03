import type { Response } from "express"
import type {
  CreateAuthTokenService,
  EmailService,
  RecoverPasswordService
} from "../services"

export class RecoverPasswordController {
  constructor(
    private readonly _res: Response,
    private readonly _recoverPasswordService: RecoverPasswordService,
    private readonly _createAuthTokenService: CreateAuthTokenService
  ) {}

  public async checkEmail(
    emailService: EmailService
  ): Promise<Response<any, Record<string, any>>> {
    const { content, isError, error } =
      await this._recoverPasswordService.checkEmail(
        this._createAuthTokenService,
        emailService
      )

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res.status(200).send({ content, error, isError })
  }

  public async newPassword(): Promise<Response<any, Record<string, any>>> {
    const { content, isError, error } =
      await this._recoverPasswordService.newPassword()

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res.status(200).send({ content, error, isError })
  }
}
