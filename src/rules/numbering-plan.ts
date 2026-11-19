import {
  COUNTRY_CALLING_CODE,
  COUNTRY_CALLING_CODE_DIGITS,
  COUNTRY_ISO,
  INTERNATIONAL_PREFIX,
  NATIONAL_PREFIX,
  NSN_LENGTH,
} from "../constants.js";
import type { PhoneNumberType } from "../types/phone-number.js";

export interface NationalNumberingPlan {
  readonly countryIso: typeof COUNTRY_ISO;
  readonly countryCallingCode: typeof COUNTRY_CALLING_CODE;
  readonly countryCallingCodeDigits: typeof COUNTRY_CALLING_CODE_DIGITS;
  readonly nationalPrefix: typeof NATIONAL_PREFIX;
  readonly internationalPrefix: typeof INTERNATIONAL_PREFIX;
  readonly nsnLength: typeof NSN_LENGTH;
  readonly mobilePrefixes: readonly string[];
  readonly fixedLinePrefixes: readonly string[];
}

/**
 * Ethiopian National Numbering Plan specification
 * Regulated by the Ethiopian Communications Authority (ECA)
 * and ITU-T E.164 recommendation.
 */
export const ETHIOPIA_NUMBERING_PLAN: NationalNumberingPlan = {
  countryIso: COUNTRY_ISO,
  countryCallingCode: COUNTRY_CALLING_CODE,
  countryCallingCodeDigits: COUNTRY_CALLING_CODE_DIGITS,
  nationalPrefix: NATIONAL_PREFIX,
  internationalPrefix: INTERNATIONAL_PREFIX,
  nsnLength: NSN_LENGTH,
  // 9 = Ethio Telecom mobile, 7 = Safaricom Ethiopia mobile
  mobilePrefixes: ["9", "7"],
  // 1-6 = Geographic fixed lines (e.g. 11 for Addis Ababa)
  fixedLinePrefixes: ["1", "2", "3", "4", "5", "6"],
} as const;

/**
 * Determine phone number type based on the first digit of the National Significant Number (NSN).
 */
export function determineNumberType(nsnFirstDigit: string): PhoneNumberType {
  if (ETHIOPIA_NUMBERING_PLAN.mobilePrefixes.includes(nsnFirstDigit)) {
    return "mobile";
  }
  if (ETHIOPIA_NUMBERING_PLAN.fixedLinePrefixes.includes(nsnFirstDigit)) {
    return "fixed_line";
  }
  return "unknown";
}
