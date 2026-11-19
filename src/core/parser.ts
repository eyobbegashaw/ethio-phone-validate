import {
  COUNTRY_CALLING_CODE,
  COUNTRY_ISO,
  NATIONAL_PREFIX,
  NSN_LENGTH,
} from "../constants.js";
import { detectOperator, UNKNOWN_OPERATOR } from "../operators/registry.js";
import { determineNumberType } from "../rules/numbering-plan.js";
import { isValidNsnLength } from "../rules/validation-rules.js";
import type { ValidationError } from "../types/errors.js";
import type { ValidationOptions } from "../types/options.js";
import type { ParsedPhoneNumber } from "../types/phone-number.js";
import { createError } from "../utils/errors.js";
import { sanitizeInput } from "../utils/sanitize.js";

export interface ParseResult {
  readonly success: boolean;
  readonly phone?: ParsedPhoneNumber;
  readonly errors: readonly ValidationError[];
}

/**
 * Parses and validates an Ethiopian phone number string.
 * Supports national (09..., 07...), international (+251..., 00251...), and bare NSN formats.
 */
export function parsePhoneNumber(
  input: unknown,
  options: ValidationOptions = {},
): ParseResult {
  const sanitizeResult = sanitizeInput(input);
  if (!sanitizeResult.success) {
    return {
      success: false,
      errors: sanitizeResult.error ? [sanitizeResult.error] : [],
    };
  }

  const cleaned = sanitizeResult.sanitized;
  let nsnCandidate = cleaned;

  // Handle international prefix (+ or 00)
  if (cleaned.startsWith("+")) {
    if (!cleaned.startsWith("+251")) {
      const detectedPrefix = cleaned.match(/^\+\d{1,4}/)?.[0] ?? cleaned.slice(0, 4);
      return {
        success: false,
        errors: [
          createError(
            "INVALID_COUNTRY_CODE",
            `Invalid country calling code: expected '+251' (Ethiopia), received '${detectedPrefix}'.`,
          ),
        ],
      };
    }
    nsnCandidate = cleaned.slice(4); // Remove "+251"
  } else if (cleaned.startsWith("00")) {
    if (!cleaned.startsWith("00251")) {
      const detectedPrefix = cleaned.match(/^00\d{1,4}/)?.[0] ?? cleaned.slice(0, 5);
      return {
        success: false,
        errors: [
          createError(
            "INVALID_COUNTRY_CODE",
            `Invalid international country code: expected '00251' (Ethiopia), received '${detectedPrefix}'.`,
          ),
        ],
      };
    }
    nsnCandidate = cleaned.slice(5); // Remove "00251"
  }

  // Strip single national trunk prefix (0) if present (e.g. "0912345678" -> "912345678" or "+251 09..." -> "9...")
  if (nsnCandidate.startsWith(NATIONAL_PREFIX)) {
    nsnCandidate = nsnCandidate.slice(1);
  }

  // Validate NSN format and length
  if (!isValidNsnLength(nsnCandidate)) {
    return {
      success: false,
      errors: [
        createError(
          "INVALID_LENGTH",
          `Invalid phone number length: Ethiopian numbers require ${NSN_LENGTH} national digits, received ${nsnCandidate.length}.`,
        ),
      ],
    };
  }

  const firstDigit = nsnCandidate.charAt(0);
  const numberType = determineNumberType(firstDigit);

  // Check type compatibility
  if (numberType === "fixed_line" && !options.allowFixedLines) {
    return {
      success: false,
      errors: [
        createError(
          "UNSUPPORTED_TYPE",
          `Fixed-line geographic numbers (starting with ${firstDigit}) are not supported mobile numbers.`,
        ),
      ],
    };
  }

  if (numberType === "unknown") {
    return {
      success: false,
      errors: [
        createError(
          "INVALID_PREFIX",
          `Invalid prefix: Ethiopian mobile numbers must begin with 09 or 07 (received '${firstDigit}').`,
        ),
      ],
    };
  }

  // Detect operator
  let operator = detectOperator(nsnCandidate);
  if (numberType === "fixed_line") {
    // Fixed-line network infrastructure in Ethiopia is managed by Ethio Telecom
    operator = {
      code: "ETHIO_TELECOM",
      name: "Ethio Telecom",
      brand: "Ethio Telecom",
      prefixes: ["11", "22", "25", "33", "34", "46", "47", "58"],
    };
  } else if (operator.code === "UNKNOWN" && options.strictOperatorPrefixes !== false) {
    return {
      success: false,
      errors: [
        createError(
          "UNKNOWN_OPERATOR",
          `Mobile prefix '${nsnCandidate.substring(0, 2)}' does not belong to an officially recognized Ethiopian mobile operator.`,
        ),
      ],
    };
  }

  const parsedPhone: ParsedPhoneNumber = {
    country: COUNTRY_ISO,
    countryCallingCode: COUNTRY_CALLING_CODE,
    nationalNumber: nsnCandidate,
    localNumber: `${NATIONAL_PREFIX}${nsnCandidate}`,
    internationalNumber: `${COUNTRY_CALLING_CODE}${nsnCandidate}`,
    prefix: nsnCandidate.substring(0, 2),
    operator: operator.code !== "UNKNOWN" ? operator : UNKNOWN_OPERATOR,
    type: numberType,
  };

  return {
    success: true,
    phone: parsedPhone,
    errors: [],
  };
}
