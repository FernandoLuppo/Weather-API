import { Router } from "express"
import type { Request, Response } from "express"
import { UserAuthenticate } from "../middleware"
import { UserService } from "../services/user/UserService"
import { UserController } from "../controllers/UserController"

const userRouter = Router()

const userAuthenticate = new UserAuthenticate()

userRouter.post(
  "/register",
  userAuthenticate.register,
  async (req: Request, res: Response) => {
    const userService = new UserService(req)
    return await new UserController(res, userService).createUser()
  }
)

export { userRouter }
