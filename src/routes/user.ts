import type { Request, Response } from "express"
import { Router } from "express"
import { TokenAuthenticate, UserAuthenticate } from "../middleware"
import { CreateAuthTokenService, UserService } from "../services"
import { UserController } from "../controllers/UserController"

const userRouter = Router()
const userAuthenticate = new UserAuthenticate()
const tokenAuthenticate = new TokenAuthenticate()

userRouter.get(
  "/get-infos",
  tokenAuthenticate.validate,
  async (req: Request, res: Response) => {
    const userService = new UserService(req)
    return await new UserController(req, res, userService).getInfos()
  }
)

//  Ver a diferenca de patch e put
userRouter.patch(
  "/update-infos",
  tokenAuthenticate.validate,
  userAuthenticate.updateInfos,
  async (req: Request, res: Response) => {
    const userService = new UserService(req)
    return await new UserController(req, res, userService).updateInfos()
  }
)

userRouter.post(
  "/register",
  userAuthenticate.register,
  async (req: Request, res: Response) => {
    const userService = new UserService(req)
    return await new UserController(req, res, userService).register()
  }
)

userRouter.post(
  "/login",
  userAuthenticate.login,
  async (req: Request, res: Response) => {
    const userService = new UserService(req)
    const createAuthTokenService = new CreateAuthTokenService()
    return await new UserController(req, res, userService).login(
      createAuthTokenService
    )
  }
)

userRouter.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("accessToken").clearCookie("refreshToken")
  res.status(200).send({
    content: { message: "Exited with success" },
    isError: false,
    error: ""
  })
})

userRouter.delete(
  "/delete",
  tokenAuthenticate.validate,
  async (req: Request, res: Response) => {
    const userService = new UserService(req)
    return await new UserController(req, res, userService).deleteUser()
  }
)

export { userRouter }
