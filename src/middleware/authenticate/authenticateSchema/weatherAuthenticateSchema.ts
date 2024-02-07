import * as yup from "yup"

export const weatherAuthenticateSchema = yup.object().shape({
  city: yup
    .string()
    .required("City field is required.")
    .matches(/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi)
})
