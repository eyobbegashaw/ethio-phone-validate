import type { OperatorCode, OperatorInfo } from "../types/operator.js";
import { ETHIO_TELECOM_OPERATOR } from "./ethio-telecom.js";
import { SAFARICOM_OPERATOR } from "./safaricom.js";

export const UNKNOWN_OPERATOR: OperatorInfo = {
  code: "UNKNOWN",
  name: "Unknown",
  brand: "Unknown",
  prefixes: [],
} as const;

class OperatorRegistry {
  private operators: Map<OperatorCode, OperatorInfo> = new Map();

  constructor() {
    this.register(ETHIO_TELECOM_OPERATOR);
    this.register(SAFARICOM_OPERATOR);
  }

  public register(operator: OperatorInfo): void {
    this.operators.set(operator.code, operator);
  }

  public getByCode(code: OperatorCode): OperatorInfo {
    return this.operators.get(code) ?? UNKNOWN_OPERATOR;
  }

  public getAll(): readonly OperatorInfo[] {
    return Array.from(this.operators.values());
  }

  /**
   * Matches the first 2 digits of the NSN against registered operator prefixes.
   */
  public detectByPrefix(prefix: string): OperatorInfo {
    for (const operator of this.operators.values()) {
      if (operator.prefixes.includes(prefix)) {
        return operator;
      }
    }
    return UNKNOWN_OPERATOR;
  }
}

export const operatorRegistry = new OperatorRegistry();

/**
 * Detect operator from a National Significant Number (NSN).
 * @param nsn 9-digit Ethiopian national significant number
 */
export function detectOperator(nsn: string): OperatorInfo {
  if (nsn.length < 2) {
    return UNKNOWN_OPERATOR;
  }
  const prefix2 = nsn.substring(0, 2);
  return operatorRegistry.detectByPrefix(prefix2);
}
