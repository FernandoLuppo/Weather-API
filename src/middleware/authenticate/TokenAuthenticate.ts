import type { NextFunction, Request, Response } from "express"
import { TokenService } from "../../services/token/TokenService"

export class TokenAuthenticate {
  public accessToken(req: Request, res: Response, next: NextFunction): void {
    const { accessToken } = req.cookies
    const tokenService = new TokenService()

    const { content, error, isError } = tokenService.validateToken(
      accessToken,
      req
    )

    if (isError) {
      res.status(401).send({ content, error, isError })
      return
    }

    next()
  }

  public refreshToken(req: Request, res: Response, next: NextFunction): void {
    const { refreshToken } = req.cookies
    const tokenService = new TokenService()

    const { content, error, isError } = tokenService.validateToken(
      refreshToken,
      req
    )

    if (isError) {
      res.status(401).send({ content, error, isError })
      return
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
