import type { Request } from "express";
import type { IResult } from "../../types";
import { sign, verify } from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string
        refreshTokenID?: string
      }
    }
  }
}

export class TokenService {
  public createToken(id: string): IResult {
    const result: IResult = {error: [], isError: false, content: {}}
    const { TOKEN_SECRET } = process.env

    if (TOKEN_SECRET === undefined) {
      result.isError = true
      result.error = ["Failed to create token."]
      return result
    }

    const token = sign({}, TOKEN_SECRET, {
      subject: id,
      expiresIn: "60m"
    })

    result.content = token
    return result
  }

  public validateToken(name: string, req: Request): IResult {
    const result: IResult = {error: [], isError: false, content: {}}
    const { TOKEN_SECRET } = process.env
    let token = ""

    switch(name) {
      case 'accessToken':
        token = req.cookies.accessToken
      break
      case 'refreshToken':
        token = req.cookies.refreshToken
      break
      case 'emailToken':
        token = req.cookies.emailToken
      break
      default:
        token = ''
    }

    if (token !==  "" && TOKEN_SECRET !== undefined) {
      const decodedToken = verify(token, TOKEN_SECRET) as {
        sub?: string
      }

      if (decodedToken.sub !== undefined) {
        req.user = {
          id: decodedToken.sub
        }
      }

      return result
    }

    result.isError = true
    result.error = ['Invalid token.']
    return result
  }
}
