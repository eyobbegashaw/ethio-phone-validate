import {
  ALLOWED_INPUT_CHARS_REGEX,
  MAX_SAFE_INPUT_LENGTH,
} from "../constants.js";
import type { ValidationError } from "../types/errors.js";

export interface SanitizeResult {
  readonly success: boolean;
  readonly sanitized: string;
  readonly error?: ValidationError;
}

/**
 * Sanitizes and pre-validates raw user input.
 * Strips whitespace, hyphens, dots, and parentheses while validating allowed characters
 * and enforcing maximum safe length to prevent ReDoS.
 */
export function sanitizeInput(input: unknown): SanitizeResult {
  if (input === null || input === undefined) {
    return {
      success: false,
      sanitized: "",
      error: {
        code: "EMPTY_INPUT",
        message: "Phone number cannot be null or undefined.",
      },
    };
  }

  if (typeof input !== "string") {
    return {
      success: false,
      sanitized: "",
      error: {
        code: "EMPTY_INPUT",
        message: "Phone number must be a string.",
      },
    };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return {
      success: false,
      sanitized: "",
      error: {
        code: "EMPTY_INPUT",
        message: "Phone number cannot be an empty string.",
      },
    };
  }

  if (trimmed.length > MAX_SAFE_INPUT_LENGTH) {
    return {
      success: false,
      sanitized: "",
      error: {
        code: "TOO_LONG",
        message: `Phone number input exceeds maximum allowed length of ${MAX_SAFE_INPUT_LENGTH} characters.`,
      },
    };
  }

  // Pre-normalize common trunk prefix in parens notation: "+251 (0) 912345678" -> "+251 912345678"
  const normalizedTrunkInParens = trimmed.replace(/^(\+251|00251)\s*\(\s*0\s*\)/, "$1");

  if (!ALLOWED_INPUT_CHARS_REGEX.test(normalizedTrunkInParens)) {
    return {
      success: false,
      sanitized: "",
      error: {
        code: "INVALID_CHARACTERS",
        message: "Phone number contains invalid characters.",
      },
    };
  }

  // Strip formatting characters (whitespace, hyphens, dots, parentheses)
  const cleaned = normalizedTrunkInParens.replace(/[\s\-.()]/g, "");

  // Ensure plus is only at the start if present
  const plusIndex = cleaned.indexOf("+");
  if (plusIndex > 0 || (plusIndex === 0 && cleaned.lastIndexOf("+") > 0)) {
    return {
      success: false,
      sanitized: "",
      error: {
        code: "INVALID_CHARACTERS",
        message: "Plus sign (+) is only permitted at the start of an international phone number.",
      },
    };
  }

  return {
    success: true,
    sanitized: cleaned,
  };
}
