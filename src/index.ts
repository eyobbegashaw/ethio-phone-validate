// Core functions
export {
  validatePhoneNumber,
  isValidPhoneNumber,
  getPhoneOperator,
  isEthioTelecom,
  isSafaricom,
} from "./core/validator.js";

export { parsePhoneNumber } from "./core/parser.js";
export type { ParseResult } from "./core/parser.js";

export { normalizePhoneNumber } from "./core/normalizer.js";

export { formatPhoneNumber, formatNationalDisplay } from "./core/formatter.js";

// Operator registry & data
export {
  ETHIO_TELECOM_OPERATOR,
  SAFARICOM_OPERATOR,
  UNKNOWN_OPERATOR,
  detectOperator,
  operatorRegistry,
} from "./operators/index.js";

// Numbering plan rules & prefixes
export {
  ETHIOPIA_NUMBERING_PLAN,
  determineNumberType,
} from "./rules/numbering-plan.js";

export {
  ETHIO_TELECOM_PREFIXES,
  SAFARICOM_PREFIXES,
  isEthioTelecomPrefix,
  isSafaricomPrefix,
} from "./rules/prefixes.js";

export type { EthioTelecomPrefix, SafaricomPrefix } from "./rules/prefixes.js";

export {
  isValidNsnLength,
  isMobileNsn,
  isFixedLineNsn,
  isValidMobilePrefix,
} from "./rules/validation-rules.js";

// Constants
export {
  COUNTRY_CALLING_CODE,
  COUNTRY_CALLING_CODE_DIGITS,
  COUNTRY_ISO,
  NATIONAL_PREFIX,
  INTERNATIONAL_PREFIX,
  NSN_LENGTH,
  LOCAL_NUMBER_LENGTH,
  INTERNATIONAL_NUMBER_LENGTH,
  MAX_SAFE_INPUT_LENGTH,
} from "./constants.js";

// Types
export type {
  ValidationResult,
  ValidationSuccessResult,
  ValidationFailureResult,
  ValidationError,
  ValidationErrorCode,
  OperatorInfo,
  OperatorCode,
  OperatorName,
  ParsedPhoneNumber,
  PhoneNumberType,
  PhoneFormat,
  FormatOptions,
  ValidationOptions,
} from "./types/index.js";
