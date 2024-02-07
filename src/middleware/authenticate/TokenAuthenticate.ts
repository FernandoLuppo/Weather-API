import type { NextFunction, Request, Response } from "express"
import { TokenService } from "../../services/token/TokenService"
import { CreateAuthTokenService } from "../../services"
import type { IResult } from "../../types"
import { v4 as uuidv4 } from "uuid"

declare global {
  namespace Express {
    interface Request {
      result?: IResult
    }
  }
}

export class TokenAuthenticate {
  public async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result: IResult = {
      content: {},
      error: [""],
      isError: false,
      hasNewCookies: false
    }
    const { accessToken, refreshToken } = req.cookies
    const tokenService = new TokenService()

    const accessTokenValidate = tokenService.validateToken(accessToken, req)
    console.log(accessTokenValidate)
    if (accessTokenValidate.isError) {
      const refreshTokenValidate = tokenService.validateToken(refreshToken, req)

      if (refreshTokenValidate.isError) {
        res.status(401).send(refreshTokenValidate)
        return
      }

      const tokenId = String(uuidv4())
      const createAuthTokens = new CreateAuthTokenService()

      const newTokens = await createAuthTokens.createAuthTokens({
        tokenId,
        userId: req.user?.subject as string,
        accessTokenTime: "60m",
        refreshTokenTime: "3d"
      })

      if (newTokens.isError) {
        res.status(401).send(newTokens)
        return
      }

      result.hasNewCookies = true
      result.content = newTokens.content
      req.result = result

      next()
      return
    }

    req.result = {
      hasNewCookies: false,
      content: {},
      isError: false,
      error: [""]
    }

    next()
  }

  public emailToken(req: Request, res: Response, next: NextFunction): void {
    const { emailToken } = req.body

    const tokenService = new TokenService()

    const { content, error, isError } = tokenService.validateToken(
      emailToken,
      req
    )

    if (isError) {
      res.status(401).send({ content, error, isError })
      return
    }

    next()
  }
}
