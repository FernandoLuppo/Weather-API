import * as yup from "yup"

export const checkEmailAuthenticateSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email field is required.")
    .trim()
    .email("Email field must contain a valid email.")
})

export const newPasswordAuthenticateSchema = yup.object().shape({
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
    .trim()
    .required("Confirm Password field is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Passwords don't match."
    )
    .oneOf([yup.ref("password")], "Passwords must match")
})
