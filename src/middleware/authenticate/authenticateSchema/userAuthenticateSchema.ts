import * as yup from "yup"

export const registerAuthenticateSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name field is required.")
    .min(3, "Name field needs more than 3 characters."),
  email: yup
    .string()
    .required("Email field is required.")
    .trim()
    .email("Email field must contain a valid email."),
  password: yup
    .string()
    .required("Password field is required")
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password field is required")
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Passwords don't match."
    )
    .oneOf([yup.ref("password")], "Passwords must match")
})

export const loginAuthenticateSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email field is required.")
    .trim()
    .email("Email field must contain a valid email."),
  password: yup
    .string()
    .required("Password field is required")
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
})

export const updateInfosAuthenticateSchema = yup.object().shape({
  name: yup.string().min(3, "Name field needs more than 3 characters."),
  email: yup.string().trim().email("Email field must contain a valid email.")
})

export const recoverPasswordAuthenticateSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password field is required")
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: yup
    .string()
    .required("Password field is required")
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
})
