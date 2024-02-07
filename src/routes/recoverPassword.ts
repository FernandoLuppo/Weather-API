import { Router } from "express"
import type { Request, Response } from "express"
import { RecoverPasswordAuthenticate, TokenAuthenticate } from "../middleware"
import { RecoverPasswordController } from "../controllers"
import {
  CreateAuthTokenService,
  EmailService,
  RecoverPasswordService
} from "../services"

const recoverPasswordRouter = Router()
const recoverPasswordAuthenticate = new RecoverPasswordAuthenticate()
const tokenAuthenticate = new TokenAuthenticate()
const createAuthTokenService = new CreateAuthTokenService()
const emailService = new EmailService()

recoverPasswordRouter.post(
  "/check-email",
  recoverPasswordAuthenticate.checkEmail,
  async (req: Request, res: Response) => {
    const recoverPasswordService = new RecoverPasswordService(req)
    await new RecoverPasswordController(
      res,
      recoverPasswordService,
      createAuthTokenService
    ).checkEmail(emailService)
  }
)

recoverPasswordRouter.post(
  "/validate-email-token",
  tokenAuthenticate.emailToken,
  (req: Request, res: Response) => {
    res.status(200).send({
      error: "",
      isError: false,
      content: { message: "Token validated with success." }
    })
  }
)

recoverPasswordRouter.patch(
  "/new-password",
  recoverPasswordAuthenticate.newPassword,
  tokenAuthenticate.emailToken,
  async (req: Request, res: Response) => {
    const recoverPasswordService = new RecoverPasswordService(req)
    await new RecoverPasswordController(
      res,
      recoverPasswordService,
      createAuthTokenService
    ).newPassword()
  }
)

export { recoverPasswordRouter }
