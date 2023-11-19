import dayjs from "dayjs"
import { Token } from "../../database/models/Token"
import { TokenService } from "./TokenService"
import { handleCatchErrors } from "../../utils"
import type { IResult } from "../../types"

interface ICreateAuthTokens {
  tokenId?: string
  userId: string
  accessTokenTime: string
  refreshTokenTime: string
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

    const accessToken = this.createToken(userId, accessTokenTime)
    const refreshToken = this.createToken(userId, refreshTokenTime)
    const refreshTokenExpiresDate = dayjs().add(3, "days").toDate()

    try {
      const token = await Token.findOne({ where: { userToken: userId } })

      if (token !== null) {
        token.userToken = userId
        token.token = refreshToken.content
        token.dataValues.expireDate = refreshTokenExpiresDate
        await token.save()

        result.content = {
          accessToken,
          refreshToken,
          message
        }
        return result
      }

      await Token.create({
        id: tokenId,
        userToken: userId,
        token: refreshToken.content,
        expireDate: refreshTokenExpiresDate
      })

      result.content = {
        accessToken,
        refreshToken,
        message
      }

      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }
}
