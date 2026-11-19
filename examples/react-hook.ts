/**
 * Example: Reusable validation hook for React form state.
 */
import { formatPhoneNumber, getPhoneOperator, validatePhoneNumber } from "../src/index.js";

export interface PhoneValidationState {
  isValid: boolean;
  operatorName: string | null;
  displayFormatted: string | null;
  errorMessage: string | null;
}

/**
 * Validates and formats user phone input on change.
 */
export function validatePhoneInput(input: string): PhoneValidationState {
  if (!input.trim()) {
    return {
      isValid: false,
      operatorName: null,
      displayFormatted: null,
      errorMessage: null,
    };
  }

  const result = validatePhoneNumber(input);

  if (result.valid) {
    const operator = getPhoneOperator(input);
    return {
      isValid: true,
      operatorName: operator?.name ?? null,
      displayFormatted: formatPhoneNumber(input, { format: "display" }),
      errorMessage: null,
    };
  }

  return {
    isValid: false,
    operatorName: null,
    displayFormatted: null,
    errorMessage: result.errors[0]?.message ?? "Invalid phone number.",
  };
}
