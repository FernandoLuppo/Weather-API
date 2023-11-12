import type { NextFunction, Request, Response } from "express"
import type { TokenService } from "../../services/token/TokenService"
import type { IResult } from "../../types"

export class TokenAuthenticate {
  public authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
    tokenService: TokenService
  ): void {
    const result: IResult = { error: [""], isError: false, content: {} }
    const token = req.cookies
    console.log("TokenAuthenticate -> token: ", token)
    const { error, isError } = tokenService.validateToken(`${token}`, req)

    if (isError) {
      result.error = error
      result.isError = isError
      result.content = "Invalid Token"
      res.status(401).send(result)
      return
    }

    next()
  }
}
