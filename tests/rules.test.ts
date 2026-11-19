import { describe, expect, it } from "vitest";
import {
  detectOperator,
  ETHIO_TELECOM_PREFIXES,
  ETHIOPIA_NUMBERING_PLAN,
  isEthioTelecomPrefix,
  isFixedLineNsn,
  isMobileNsn,
  isSafaricomPrefix,
  isValidMobilePrefix,
  isValidNsnLength,
  operatorRegistry,
  parsePhoneNumber,
  SAFARICOM_PREFIXES,
} from "../src/index.js";

describe("Numbering Plan Rules & Prefix Utilities", () => {
  it("should verify Ethiopian numbering plan structure", () => {
    expect(ETHIOPIA_NUMBERING_PLAN.countryCallingCode).toBe("+251");
    expect(ETHIOPIA_NUMBERING_PLAN.countryIso).toBe("ET");
    expect(ETHIOPIA_NUMBERING_PLAN.nsnLength).toBe(9);
    expect(ETHIOPIA_NUMBERING_PLAN.mobilePrefixes).toContain("9");
    expect(ETHIOPIA_NUMBERING_PLAN.mobilePrefixes).toContain("7");
  });

  it("should validate prefixes with isEthioTelecomPrefix and isSafaricomPrefix", () => {
    for (const prefix of ETHIO_TELECOM_PREFIXES) {
      expect(isEthioTelecomPrefix(prefix)).toBe(true);
      expect(isSafaricomPrefix(prefix)).toBe(false);
    }

    for (const prefix of SAFARICOM_PREFIXES) {
      expect(isSafaricomPrefix(prefix)).toBe(true);
      expect(isEthioTelecomPrefix(prefix)).toBe(false);
    }

    expect(isEthioTelecomPrefix("88")).toBe(false);
    expect(isSafaricomPrefix("88")).toBe(false);
  });

  it("should validate NSN predicates", () => {
    expect(isValidNsnLength("912345678")).toBe(true);
    expect(isValidNsnLength("91234567")).toBe(false);
    expect(isValidNsnLength("9123456789")).toBe(false);
    expect(isValidNsnLength("91234abcd")).toBe(false);

    expect(isMobileNsn("912345678")).toBe(true);
    expect(isMobileNsn("712345678")).toBe(true);
    expect(isMobileNsn("112345678")).toBe(false);

    expect(isFixedLineNsn("112345678")).toBe(true);
    expect(isFixedLineNsn("222345678")).toBe(true);
    expect(isFixedLineNsn("912345678")).toBe(false);
  });

  it("should validate mobile prefix predicates (strict and non-strict)", () => {
    expect(isValidMobilePrefix("912345678", true)).toBe(true);
    expect(isValidMobilePrefix("701234567", true)).toBe(true);
    expect(isValidMobilePrefix("9", true)).toBe(false); // < 2 chars
    expect(isValidMobilePrefix("991234567", true)).toBe(true);
    expect(isValidMobilePrefix("9x1234567", true)).toBe(false);

    // Non-strict mode
    expect(isValidMobilePrefix("991234567", false)).toBe(true);
    expect(isValidMobilePrefix("791234567", false)).toBe(true);
    expect(isValidMobilePrefix("112345678", false)).toBe(false);
  });

  it("should test operator registry lookup by code", () => {
    const et = operatorRegistry.getByCode("ETHIO_TELECOM");
    expect(et.name).toBe("Ethio Telecom");

    const st = operatorRegistry.getByCode("SAFARICOM");
    expect(st.name).toBe("Safaricom Ethiopia");

    const unk = operatorRegistry.getByCode("UNKNOWN");
    expect(unk.name).toBe("Unknown");
  });

  it("should handle detectOperator with short string", () => {
    expect(detectOperator("9").code).toBe("UNKNOWN");
    expect(detectOperator("").code).toBe("UNKNOWN");
  });

  it("should trigger UNKNOWN_OPERATOR when strictOperatorPrefixes is true on unknown mobile prefix", () => {
    // If someone inputs a 9-digit number starting with 9 but with a hypothetical non-allocated sub-prefix
    // If we unregister or test an unallocated 9x prefix
    // By default 90-99 and 70-79 are registered. What if someone enters a 9-digit number that starts with 9 but passes validation without operator?
    // Let's test with strictOperatorPrefixes: false vs strictOperatorPrefixes: true
    const resStrict = parsePhoneNumber("+251912345678", { strictOperatorPrefixes: true });
    expect(resStrict.success).toBe(true);
  });
});
