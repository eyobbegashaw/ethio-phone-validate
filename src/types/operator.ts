export type OperatorCode = "ETHIO_TELECOM" | "SAFARICOM" | "UNKNOWN";

export type OperatorName = "Ethio Telecom" | "Safaricom Ethiopia" | "Unknown";

export interface OperatorInfo {
  readonly code: OperatorCode;
  readonly name: OperatorName;
  readonly brand: string;
  readonly prefixes: readonly string[];
}
