import { NSN_LENGTH } from "../constants.js";
import { isEthioTelecomPrefix, isSafaricomPrefix } from "./prefixes.js";

/**
 * Validates if the given string represents a valid National Significant Number (NSN) length.
 * For Ethiopia, NSN is exactly 9 digits.
 */
export function isValidNsnLength(nsn: string): boolean {
  return nsn.length === NSN_LENGTH && /^\d+$/.test(nsn);
}

/**
 * Checks if the NSN begins with a valid Ethiopian mobile NDC (9 or 7).
 */
export function isMobileNsn(nsn: string): boolean {
  return nsn.startsWith("9") || nsn.startsWith("7");
}

/**
 * Checks if the NSN begins with a valid Ethiopian geographic fixed-line code (1-6).
 */
export function isFixedLineNsn(nsn: string): boolean {
  return /^[1-6]/.test(nsn);
}

/**
 * Checks if the NSN starts with an authoritative Ethiopian mobile prefix.
 */
export function isValidMobilePrefix(nsn: string, strict = true): boolean {
  if (nsn.length < 2) {
    return false;
  }
  const prefix = nsn.substring(0, 2);
  if (strict) {
    return isEthioTelecomPrefix(prefix) || isSafaricomPrefix(prefix);
  }
  return isMobileNsn(nsn);
}
