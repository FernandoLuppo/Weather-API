import type { Request } from "express"
import { handleCatchErrors } from "../../utils"
import { User } from "../../database/models/User"
import type { IResult } from "../../types"
import type { CreateAuthTokenService } from "../token/CreateAuthTokenService"
import { v4 as uuidv4 } from "uuid"

export class AuthenticateService {
  constructor(
    private readonly _req: Request,
    private readonly _createAuthTokenService: CreateAuthTokenService
  ) {}

  public async newAccessAndRefreshToken(): Promise<IResult> {
    let result: IResult = { error: [""], isError: false, content: {} }
    const userId = this._req.user?.id
    const tokenId = uuidv4()

    try {
      const user = await User.findOne({ where: { userId } })
      if (user === null) {
        result.isError = true
        result.error = ["Invalid token."]
        return result
      }

      const createAuthTokens =
        await this._createAuthTokenService.createAuthTokens({
          tokenId,
          userId: user.id,
          accessTokenTime: "60m",
          refreshTokenTime: "3d",
          message: "User logged with success!"
        })

      if (createAuthTokens.isError) {
        result.isError = true
        result.error = createAuthTokens.error
        return result
      }

      result = createAuthTokens
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }

  public newEmailToken(): void {}
}
