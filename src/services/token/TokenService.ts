import type { Request } from "express"
import type { IResult } from "../../types"
import { sign, verify } from "jsonwebtoken"
import { handleCatchErrors } from "../../utils"

declare global {
  namespace Express {
    interface Request {
      user?: {
        subject: string
        payload: any
      }
    }
  }
}

export class TokenService {
  protected createToken(
    payload: any,
    subject: string = "",
    expiresIn: string
  ): IResult {
    const result: IResult = { error: [], isError: false, content: {} }
    const { TOKEN_SECRET } = process.env

    if (TOKEN_SECRET === undefined) {
      result.isError = true
      result.error = ["Failed to create token."]
      return result
    }

    const token = sign({ payload }, TOKEN_SECRET, {
      subject,
      expiresIn
    })

    result.content = token
    return result
  }

  public validateToken(token: any, req: Request): IResult {
    const result: IResult = { error: [], isError: false, content: {} }
    const { TOKEN_SECRET } = process.env

    if (
      token === "" &&
      token === undefined &&
      token === null &&
      TOKEN_SECRET === undefined
    ) {
      result.isError = true
      result.error = ["Invalid token."]
      return result
    }

    try {
      const decodedToken = verify(token, TOKEN_SECRET as string) as {
        sub?: string
        payload?: any
      }

      if (decodedToken.sub !== undefined) {
        req.user = {
          subject: decodedToken.sub,
          payload: decodedToken.payload
        }
      }

      result.content = decodedToken.sub
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }
}
