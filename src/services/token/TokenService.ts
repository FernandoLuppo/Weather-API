import type { Request } from "express"
import type { IResult } from "../../types"
import { sign, verify } from "jsonwebtoken"
import { handleCatchErrors } from "../../utils"

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
  protected createToken(id: string, date: string): IResult {
    const result: IResult = { error: [], isError: false, content: {} }
    const { TOKEN_SECRET } = process.env

    if (TOKEN_SECRET === undefined) {
      result.isError = true
      result.error = ["Failed to create token."]
      return result
    }

    const token = sign({}, TOKEN_SECRET, {
      subject: id,
      expiresIn: date
    })

    result.content = token
    return result
  }

  public validateToken(token: string, req: Request): IResult {
    const result: IResult = { error: [], isError: false, content: {} }
    const { TOKEN_SECRET } = process.env

    try {
      if (token !== "" && TOKEN_SECRET !== undefined) {
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
      result.error = ["Invalid token."]
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }
}
