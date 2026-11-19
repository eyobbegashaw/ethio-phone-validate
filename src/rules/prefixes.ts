/**
 * Authoritative mobile prefixes allocated in Ethiopia.
 *
 * Ethio Telecom:
 * Uses the '9' National Destination Code (NDC).
 * Officially allocated series: 090, 091, 092, 093, 094, 095, 096, 097, 098, 099.
 *
 * Safaricom Ethiopia:
 * Uses the '7' National Destination Code (NDC).
 * Officially allocated series: 070, 071, 072, 074, 077, 078, 079 (and all 70-79 series).
 */

export const ETHIO_TELECOM_PREFIXES = [
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
] as const;

export const SAFARICOM_PREFIXES = [
  "70",
  "71",
  "72",
  "74",
  "77",
  "78",
  "79",
] as const;

export type EthioTelecomPrefix = (typeof ETHIO_TELECOM_PREFIXES)[number];
export type SafaricomPrefix = (typeof SAFARICOM_PREFIXES)[number];

export function isEthioTelecomPrefix(prefix: string): boolean {
  return (ETHIO_TELECOM_PREFIXES as readonly string[]).includes(prefix);
}

export function isSafaricomPrefix(prefix: string): boolean {
  return (SAFARICOM_PREFIXES as readonly string[]).includes(prefix);
}
