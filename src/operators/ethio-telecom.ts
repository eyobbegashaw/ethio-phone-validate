import { ETHIO_TELECOM_PREFIXES } from "../rules/prefixes.js";
import type { OperatorInfo } from "../types/operator.js";

export const ETHIO_TELECOM_OPERATOR: OperatorInfo = {
  code: "ETHIO_TELECOM",
  name: "Ethio Telecom",
  brand: "Ethio Telecom",
  prefixes: ETHIO_TELECOM_PREFIXES,
} as const;
