export type ValidationErrorCode =
  | "EMPTY_INPUT"
  | "INVALID_CHARACTERS"
  | "TOO_LONG"
  | "INVALID_COUNTRY_CODE"
  | "INVALID_LENGTH"
  | "INVALID_PREFIX"
  | "UNSUPPORTED_TYPE"
  | "UNKNOWN_OPERATOR";

export interface ValidationError {
  readonly code: ValidationErrorCode;
  readonly message: string;
}
