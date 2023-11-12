import type { Response } from "express"
import type { UserService } from "../services/user/UserService"
import type { IResult } from "../types"
import type { TokenService } from "../services/token/TokenService"

export class UserController {
  constructor(
    private readonly _res: Response,
    private readonly _userService: UserService
  ) {}

  public async createUser(): Promise<Response<any, Record<string, any>>> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { content, error, isError } = await this._userService.register()

    if (isError) {
      result.isError = true
      result.error = error
      return this._res.status(401).send(result)
    }
    result.content = content

    return this._res.status(201).send(result)
  }

  public async getUser(
    tokenService: TokenService
  ): Promise<Response<any, Record<string, any>>> {
    const result: IResult = { error: [""], isError: false, content: {} }

    const { content, error, isError } =
      await this._userService.login(tokenService)

    if (isError) {
      result.error = error
      result.isError = isError
      return this._res.status(401).send(result)
    }
    result.content = "User Logged with success"

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
      .send(result)
  }
}
