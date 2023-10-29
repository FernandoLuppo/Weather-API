import bcryptjs from "bcrypt"
import type { IResult } from "../../types"
import { handleCatchErrors } from "../../utils"

export class EncryptPasswordService {
  constructor(private readonly _userPassword: string) {}

  public encrypt(): IResult {
    const result: IResult = { error: [""], isError: false, content: {} }

    const encryption = bcryptjs.genSaltSync(10)
    const encryptedPassword = bcryptjs.hashSync(this._userPassword, encryption)

    result.content = encryptedPassword
    return result
  }

  public async compare(databasePassword: string): Promise<IResult> {
    const result: IResult = { error: [""], isError: false, content: {} }

    try {
      const isEncrypted = await bcryptjs.compare(
        this._userPassword,
        databasePassword
      )

      if (isEncrypted !== null && isEncrypted !== undefined) {
        return result
      }

      result.isError = true
      result.error = ["Email or password incorrect"]
      return result
    } catch (error) {
      return handleCatchErrors(error)
    }
  }
}
