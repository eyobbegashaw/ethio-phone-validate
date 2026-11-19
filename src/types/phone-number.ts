import type { OperatorInfo } from "./operator.js";

export type PhoneNumberType = "mobile" | "fixed_line" | "unknown";

export type PhoneFormat = "national" | "international" | "display" | "e164" | "rfc3966";

export interface ParsedPhoneNumber {
  readonly country: "ET";
  readonly countryCallingCode: "+251";
  readonly nationalNumber: string;
  readonly localNumber: string;
  readonly internationalNumber: string;
  readonly prefix: string;
  readonly operator: OperatorInfo;
  readonly type: PhoneNumberType;
}
