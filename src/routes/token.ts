import { type Request, type Response, Router } from "express"
import { TokenAuthenticate } from "../middleware"
import { TokenController } from "../controllers"
import { CreateAuthTokenService } from "../services"

const tokenRouter = Router()
const tokenAuthenticate = new TokenAuthenticate()

tokenRouter.get(
  "/new-tokens",
  tokenAuthenticate.refreshToken,
  async (req: Request, res: Response) => {
    const createAuthTokenService = new CreateAuthTokenService()
    await new TokenController(req, res, createAuthTokenService).authTokens()
  }
)

export { tokenRouter }
