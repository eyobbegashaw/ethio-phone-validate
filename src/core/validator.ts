import type { OperatorInfo } from "../types/operator.js";
import type { ValidationOptions } from "../types/options.js";
import type {
  ValidationFailureResult,
  ValidationResult,
  ValidationSuccessResult,
} from "../types/validation-result.js";
import { formatPhoneNumber } from "./formatter.js";
import { parsePhoneNumber } from "./parser.js";

/**
 * Validates an Ethiopian phone number and returns comprehensive validation metadata.
 * Never throws exceptions; returns structured errors upon failure.
 *
 * @param input Raw phone number input
 * @param options Validation options
 * @returns Structured validation result
 */
export function validatePhoneNumber(
  input: unknown,
  options: ValidationOptions = {},
): ValidationResult {
  const parseResult = parsePhoneNumber(input, options);

  if (!parseResult.success || !parseResult.phone) {
    const failureResult: ValidationFailureResult = {
      valid: false,
      country: null,
      countryCallingCode: null,
      nationalNumber: null,
      internationalNumber: null,
      localNumber: null,
      operator: null,
      operatorCode: null,
      formatted: null,
      type: null,
      errors: parseResult.errors,
    };
    return failureResult;
  }

  const phone = parseResult.phone;
  const formatted = formatPhoneNumber(phone.internationalNumber, { format: "display" }) ?? "";

  const successResult: ValidationSuccessResult = {
    valid: true,
    country: phone.country,
    countryCallingCode: phone.countryCallingCode,
    nationalNumber: phone.nationalNumber,
    internationalNumber: phone.internationalNumber,
    localNumber: phone.localNumber,
    operator: phone.operator.name,
    operatorCode: phone.operator.code,
    formatted,
    type: phone.type,
    errors: [],
  };

  return successResult;
}

/**
 * Simple boolean check: returns true if the input is a valid Ethiopian mobile number.
 *
 * @param input Raw phone number input
 * @param options Validation options
 */
export function isValidPhoneNumber(
  input: unknown,
  options: ValidationOptions = {},
): boolean {
  return validatePhoneNumber(input, options).valid;
}

/**
 * Extracts and identifies the telecommunications operator for an Ethiopian phone number.
 * Returns null if the number is invalid or the operator is unrecognized.
 *
 * @param input Raw phone number input
 */
export function getPhoneOperator(input: unknown): OperatorInfo | null {
  const result = parsePhoneNumber(input);
  if (!result.success || !result.phone || result.phone.operator.code === "UNKNOWN") {
    return null;
  }
  return result.phone.operator;
}

/**
 * Checks if the phone number belongs to Ethio Telecom.
 */
export function isEthioTelecom(input: unknown): boolean {
  const op = getPhoneOperator(input);
  return op !== null && op.code === "ETHIO_TELECOM";
}

/**
 * Checks if the phone number belongs to Safaricom Ethiopia.
 */
export function isSafaricom(input: unknown): boolean {
  const op = getPhoneOperator(input);
  return op !== null && op.code === "SAFARICOM";
}
