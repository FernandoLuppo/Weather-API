import type { IResult } from "../types"
import type * as yup from "yup"

export const handleCatchErrors = (error: unknown): IResult => {
  const result: IResult = { error: [""], isError: false, content: {} }
  console.log("Has a error: ", error)
  const err = error as Error
  result.error = [err.message]
  result.isError = true

  return result
}

export const handleRegisterCatchErrors = (error: any): IResult => {
  const result: IResult = { error: [""], isError: false, content: {} }
  console.log("Has a error: ", error)
  result.error = [error.errors[0].message]
  result.isError = true

  return result
}

export const handleYupErrors = (item: yup.ValidationError): IResult => {
  const result: IResult = { error: [""], isError: false, content: {} }
  console.log("Yup Error: ", item.errors)
  if (item.errors !== undefined) {
    item.errors.forEach(error => {
      result.error.push(error)
    })
    result.isError = true
    return result
  }

  return handleCatchErrors(item)
}
