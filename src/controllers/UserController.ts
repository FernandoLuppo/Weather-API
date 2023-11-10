import type { Response } from "express"
import type { UserService } from "../services/user/UserService"
import type { IResult } from "../types"

export class UserController {
  constructor(
    private readonly _res: Response,
    private readonly _userService: UserService
  ) {}

  public async createUser(): Promise<Response<any, Record<string, any>>> {
    const result: IResult = { error: [""], isError: false, content: {} }
    const { error, isError } = await this._userService.register()

    if (isError) {
      result.isError = true
      result.error = error
      return this._res.status(401).send({ content: "Error when create user." })
    }

    return this._res.status(201).send({ content: "User create with success!" })
  }
}
