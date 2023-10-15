import type { Request } from 'express'
import type { UserValidation } from './UserValidation'
import type { IResult } from '../../types'

export class User {
  public constructor(private readonly _request: Request) {}

  public getInfos(): void {}

  public updateInfos(): void {}

  public deleteUser(): void {}

  public register(): void {}

  public login(): void {}

  private async _registerValidation(
    userValidation: UserValidation
  ): Promise<IResult> {
    const result: IResult = { error: [''], isError: false, data: '' }

    const { data, error, isError } =
      await userValidation.registerDataValidation()

    if (isError) {
      result.error = error
      result.isError = isError
      return result
    }

    return result
  }

  private _loginValidation(): void {}
}
