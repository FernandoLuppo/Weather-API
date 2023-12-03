import { template } from "./template"

interface IProps {
  from: string
  to: string
  subject: string
  html: string
}

export const recoverPasswordTemplate = (
  sender: string,
  receiveEmail: string,
  receiveName: string,
  code: number
): IProps => {
  const html = template(receiveName, code)

  const emailTemplate = {
    from: sender,
    to: receiveEmail,
    subject: "LuppoTW - Recover Password!",
    html
  }

  return emailTemplate
}
