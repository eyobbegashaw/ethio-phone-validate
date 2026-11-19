import type { PhoneFormat } from "./phone-number.js";

export interface FormatOptions {
  /**
   * The desired output format.
   * - 'international': `+251912345678` (E.164 standard)
   * - 'national': `0912345678` (Domestic trunk format)
   * - 'display': `+251 91 234 5678` (Human-readable international format)
   * - 'rfc3966': `tel:+251-91-234-5678` (RFC 3966 URI)
   * @default 'display'
   */
  readonly format?: PhoneFormat;

  /**
   * Optional custom delimiter for display formatting.
   * @default ' '
   */
  readonly separator?: string;
}

export interface ValidationOptions {
  /**
   * Whether to allow fixed-line (landline) numbers.
   * Defaults to false, strictly enforcing mobile numbers.
   * @default false
   */
  readonly allowFixedLines?: boolean;

  /**
   * Whether to strictly enforce known operator prefix allocations.
   * @default true
   */
  readonly strictOperatorPrefixes?: boolean;
}
