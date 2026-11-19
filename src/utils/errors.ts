import type { ValidationError, ValidationErrorCode } from "../types/errors.js";

export function createError(code: ValidationErrorCode, message: string): ValidationError {
  return { code, message };
}

export const ERROR_MESSAGES: Record<ValidationErrorCode, string> = {
  EMPTY_INPUT: "Phone number cannot be empty or null.",
  INVALID_CHARACTERS: "Phone number contains invalid characters.",
  TOO_LONG: "Phone number input exceeds maximum allowable length.",
  INVALID_COUNTRY_CODE: "Country code must be +251 (Ethiopia).",
  INVALID_LENGTH: "Ethiopian mobile numbers must contain 9 digits in national significant number.",
  INVALID_PREFIX: "Invalid prefix: Ethiopian mobile numbers must begin with 09 or 07.",
  UNSUPPORTED_TYPE: "Number is a fixed-line or non-mobile number.",
  UNKNOWN_OPERATOR: "Mobile prefix does not match any recognized Ethiopian operator.",
};
