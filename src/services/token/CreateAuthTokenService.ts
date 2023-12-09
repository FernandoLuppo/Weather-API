import type { IResult } from "../../types"
import dayjs from "dayjs"
import { Token } from "../../database/models/Token"
import { TokenService } from "./TokenService"
import { handleCatchErrors } from "../../utils"

interface ICreateAuthTokens {
  tokenId?: string
  userId: string
  accessTokenTime: string
  refreshTokenTime: string
  message?: string
}

interface ICreateEmailTokens {
  payload: number
  subject: string
  emailTokenTime: string
  message?: string
}

export class CreateAuthTokenService extends TokenService {
  public async createAuthTokens({
    tokenId,
    userId,
    accessTokenTime,
    refreshTokenTime,
    message
  }: ICreateAuthTokens): Promise<IResult> {
    const result: IResult = { error: [], isError: false, content: {} }
    const { content, error, isError } = this._validationCreateAuthTokens({
      userId,
      accessTokenTime,
      refreshTokenTime
    })
    const refreshTokenExpiresDate = dayjs().add(3, "days").toDate()

    if (isError) {
      return { content, error, isError }
    }

    try {
      const token = await Token.findOne({ where: { userToken: userId } })

      if (token !== null) {
        token.userToken = userId
        token.token = content.refreshToken
        token.dataValues.expireDate = refreshTokenExpiresDate
        token.updatedAt = new Date()
        await token.save()

        result.content = {
          accessToken: content.accessToken,
          refreshToken: content.refreshToken,
          message
        }
        return result
      }

      await Token.create({
        id: tokenId,
        userToken: userId,
        token: content.refreshToken,
        expireDate: refreshTokenExpiresDate
      })

      result.content = {
        accessToken: content.accessToken,
        refreshToken: content.refreshToken,
        message
      }

      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public async createEmailToken({
    payload,
    subject,
    emailTokenTime,
    message
  }: ICreateEmailTokens): Promise<IResult> {
    let result: IResult = { error: [], isError: false, content: {} }

    const emailToken = this.createToken(payload, subject, emailTokenTime)

    if (emailToken.isError) {
      result = emailToken
      return result
    }

    result.content = {
      emailToken: emailToken.content,
      message
    }
    return result
  }

  private _validationCreateAuthTokens({
    userId,
    accessTokenTime,
    refreshTokenTime
  }: ICreateAuthTokens): IResult {
    let result: IResult = { error: [], isError: false, content: {} }

    const accessToken = this.createToken("", userId, accessTokenTime)
    const refreshToken = this.createToken("", userId, refreshTokenTime)

    if (accessToken.isError) {
      result = accessToken
      return result
    }

    if (refreshToken.isError) {
      result = refreshToken
      return result
    }

    result.content = {
      accessToken: accessToken.content,
      refreshToken: refreshToken.content
    }
    return result
  }
}
