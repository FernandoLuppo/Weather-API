import type { Response } from "express"
import type { UserService } from "../services"
import type { CreateAuthTokenService } from "../services/token/CreateAuthTokenService"

export class UserController {
  constructor(
    private readonly _res: Response,
    private readonly _userService: UserService
  ) {}

  public async getInfos(): Promise<Response<any, Record<string, any>>> {
    const { content, error, isError } = await this._userService.getInfos()

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res.status(201).send({ content, error, isError })
  }

  public async updateInfos(): Promise<Response<any, Record<string, any>>> {
    const { content, error, isError } = await this._userService.updateInfos()

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res.status(201).send({ content, error, isError })
  }

  public async register(): Promise<Response<any, Record<string, any>>> {
    const { content, error, isError } = await this._userService.register()

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res.status(201).send({ content, error, isError })
  }

  public async login(
    createAuthTokenService: CreateAuthTokenService
  ): Promise<Response<any, Record<string, any>>> {
    const { content, error, isError } = await this._userService.login(
      createAuthTokenService
    )

    if (isError) return this._res.status(401).send({ error, isError })

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
      .send({ content: { message: "Logged with success!" }, error, isError })
  }

  public async deleteUser(): Promise<Response<any, Record<string, any>>> {
    const { content, error, isError } = await this._userService.deleteUser()

    if (isError) return this._res.status(401).send({ content, error, isError })

    return this._res.status(201).send({ content, error, isError })
  }
}
