import type { FormatOptions } from "../types/options.js";
import { parsePhoneNumber } from "./parser.js";

/**
 * Formats an Ethiopian phone number according to the specified options.
 *
 * Supported formats:
 * - 'display': `+251 91 234 5678` (default)
 * - 'international': `+251912345678`
 * - 'national': `0912345678`
 * - 'rfc3966': `tel:+251-91-234-5678`
 *
 * @param input Raw phone number string
 * @param options Formatting configuration
 * @returns Formatted phone string or null if the input is not a valid number.
 */
export function formatPhoneNumber(
  input: unknown,
  options: FormatOptions = {},
): string | null {
  const result = parsePhoneNumber(input);
  if (!result.success || !result.phone) {
    return null;
  }

  const { format = "display", separator = " " } = options;
  const nsn = result.phone.nationalNumber;

  switch (format) {
    case "national":
      return result.phone.localNumber;

    case "international":
    case "e164":
      return result.phone.internationalNumber;

    case "rfc3966":
      return `tel:+251-${nsn.slice(0, 2)}-${nsn.slice(2, 5)}-${nsn.slice(5)}`;

    case "display":
    default:
      // Formats as "+251 91 234 5678" or "+251-91-234-5678"
      return `+251${separator}${nsn.slice(0, 2)}${separator}${nsn.slice(2, 5)}${separator}${nsn.slice(5)}`;
  }
}

/**
 * Formats an Ethiopian phone number in national display format:
 * e.g., "091 234 5678" or "070 123 4567".
 */
export function formatNationalDisplay(input: unknown, separator = " "): string | null {
  const result = parsePhoneNumber(input);
  if (!result.success || !result.phone) {
    return null;
  }
  const nsn = result.phone.nationalNumber;
  return `0${nsn.slice(0, 2)}${separator}${nsn.slice(2, 5)}${separator}${nsn.slice(5)}`;
}
