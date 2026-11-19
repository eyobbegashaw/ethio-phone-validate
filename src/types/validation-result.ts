import type { ValidationError } from "./errors.js";
import type { OperatorCode, OperatorName } from "./operator.js";
import type { PhoneNumberType } from "./phone-number.js";

export interface ValidationSuccessResult {
  readonly valid: true;
  readonly country: "ET";
  readonly countryCallingCode: "+251";
  readonly nationalNumber: string;
  readonly internationalNumber: string;
  readonly localNumber: string;
  readonly operator: OperatorName;
  readonly operatorCode: OperatorCode;
  readonly formatted: string;
  readonly type: PhoneNumberType;
  readonly errors: readonly [];
}

export interface ValidationFailureResult {
  readonly valid: false;
  readonly country: "ET" | null;
  readonly countryCallingCode: "+251" | null;
  readonly nationalNumber: string | null;
  readonly internationalNumber: string | null;
  readonly localNumber: string | null;
  readonly operator: OperatorName | null;
  readonly operatorCode: OperatorCode | null;
  readonly formatted: string | null;
  readonly type: PhoneNumberType | null;
  readonly errors: readonly ValidationError[];
}

export type ValidationResult = ValidationSuccessResult | ValidationFailureResult;
