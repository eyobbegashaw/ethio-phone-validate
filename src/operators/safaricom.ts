import { SAFARICOM_PREFIXES } from "../rules/prefixes.js";
import type { OperatorInfo } from "../types/operator.js";

export const SAFARICOM_OPERATOR: OperatorInfo = {
  code: "SAFARICOM",
  name: "Safaricom Ethiopia",
  brand: "Safaricom Ethiopia",
  prefixes: SAFARICOM_PREFIXES,
} as const;
