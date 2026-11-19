import type { FormatOptions } from "../types/options.js";
import { parsePhoneNumber } from "./parser.js";

/**
 * Normalizes an Ethiopian phone number to a standard canonical format.
 * Returns null if the phone number is invalid or cannot be normalized.
 *
 * @param input Raw phone number string
 * @param options Format options (defaults to 'international' -> '+251912345678')
 * @returns Normalized phone number string, or null if invalid.
 */
export function normalizePhoneNumber(
  input: unknown,
  options: FormatOptions = {},
): string | null {
  const result = parsePhoneNumber(input);
  if (!result.success || !result.phone) {
    return null;
  }

  const { format = "international" } = options;

  switch (format) {
    case "national":
      return result.phone.localNumber;
    case "display": {
      const sep = options.separator ?? " ";
      const p = result.phone.nationalNumber;
      // Format: +251 91 234 5678
      return `+251${sep}${p.slice(0, 2)}${sep}${p.slice(2, 5)}${sep}${p.slice(5)}`;
    }
    case "rfc3966": {
      const p = result.phone.nationalNumber;
      return `tel:+251-${p.slice(0, 2)}-${p.slice(2, 5)}-${p.slice(5)}`;
    }
    case "e164":
    case "international":
    default:
      return result.phone.internationalNumber;
  }
}
