import type { Request, Response } from "express"
import type { CreateAuthTokenService } from "../services"
import { v4 as uuidv4 } from "uuid"

export class TokenController {
  constructor(
    private readonly _req: Request,
    private readonly _res: Response,
    private readonly _createAuthTokenService: CreateAuthTokenService
  ) {}

  public async authTokens(): Promise<Response<any, Record<string, any>>> {
    const userId = this._req.user?.id as string
    const tokenId = uuidv4()

    const { content, error, isError } =
      await this._createAuthTokenService.createAuthTokens({
        tokenId,
        userId,
        accessTokenTime: "60m",
        refreshTokenTime: "3d"
      })

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res
      .status(200)
      .cookie("accessToken", content.accessToken, {
        maxAge: 3.6e6,
        httpOnly: false,
        sameSite: "lax"
      })
      .cookie("refreshToken", content.refreshToken, {
        maxAge: 2.592e8,
        httpOnly: false,
        sameSite: "lax"
      })
      .send({ content, error, isError })
  }
}
