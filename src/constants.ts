export const COUNTRY_ISO = "ET" as const;
export const COUNTRY_CALLING_CODE = "+251" as const;
export const COUNTRY_CALLING_CODE_DIGITS = "251" as const;
export const NATIONAL_PREFIX = "0" as const;
export const INTERNATIONAL_PREFIX = "00" as const;

/**
 * National Significant Number (NSN) length for Ethiopia according to ITU-T E.164.
 */
export const NSN_LENGTH = 9;

/**
 * Expected character length for domestic format (e.g., '0912345678').
 */
export const LOCAL_NUMBER_LENGTH = 10;

/**
 * Expected character length for international E.164 format (e.g., '+251912345678').
 */
export const INTERNATIONAL_NUMBER_LENGTH = 13;

/**
 * Maximum safe character length allowed for input to prevent ReDoS attacks
 * and resource exhaustion.
 */
export const MAX_SAFE_INPUT_LENGTH = 50;

/**
 * Characters permissible in formatted phone inputs:
 * Digits, leading plus (+), hyphens (-), periods (.), spaces ( ), parentheses (()).
 */
export const ALLOWED_INPUT_CHARS_REGEX = /^[\d\s+\-().]+$/;
