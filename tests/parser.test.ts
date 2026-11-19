import { describe, expect, it } from "vitest";
import { parsePhoneNumber } from "../src/index.js";

describe("parsePhoneNumber", () => {
  it("should parse domestic format with trunk 0 correctly", () => {
    const res = parsePhoneNumber("0912345678");
    expect(res.success).toBe(true);
    expect(res.phone).toBeDefined();
    expect(res.phone?.country).toBe("ET");
    expect(res.phone?.countryCallingCode).toBe("+251");
    expect(res.phone?.nationalNumber).toBe("912345678");
    expect(res.phone?.localNumber).toBe("0912345678");
    expect(res.phone?.internationalNumber).toBe("+251912345678");
    expect(res.phone?.prefix).toBe("91");
    expect(res.phone?.operator.code).toBe("ETHIO_TELECOM");
    expect(res.phone?.type).toBe("mobile");
  });

  it("should parse international format with +251 correctly", () => {
    const res = parsePhoneNumber("+251701234567");
    expect(res.success).toBe(true);
    expect(res.phone).toBeDefined();
    expect(res.phone?.countryCallingCode).toBe("+251");
    expect(res.phone?.nationalNumber).toBe("701234567");
    expect(res.phone?.localNumber).toBe("0701234567");
    expect(res.phone?.internationalNumber).toBe("+251701234567");
    expect(res.phone?.prefix).toBe("70");
    expect(res.phone?.operator.code).toBe("SAFARICOM");
  });

  it("should parse bare 9-digit NSN format correctly", () => {
    const res = parsePhoneNumber("912345678");
    expect(res.success).toBe(true);
    expect(res.phone?.nationalNumber).toBe("912345678");
    expect(res.phone?.localNumber).toBe("0912345678");
    expect(res.phone?.internationalNumber).toBe("+251912345678");
  });

  it("should handle formatting noise (whitespace, dashes, parens, dots)", () => {
    const res = parsePhoneNumber("+251 (0) 91.234-5678");
    expect(res.success).toBe(true);
    expect(res.phone?.nationalNumber).toBe("912345678");
  });

  it("should fail gracefully on null input", () => {
    const res = parsePhoneNumber(null);
    expect(res.success).toBe(false);
    expect(res.phone).toBeUndefined();
    expect(res.errors[0]?.code).toBe("EMPTY_INPUT");
  });

  it("should fail gracefully on invalid country code", () => {
    const res = parsePhoneNumber("+14155552671");
    expect(res.success).toBe(false);
    expect(res.errors[0]?.code).toBe("INVALID_COUNTRY_CODE");
  });

  it("should handle non-digit country code edge cases", () => {
    const resPlus = parsePhoneNumber("+");
    expect(resPlus.success).toBe(false);

    const res00 = parsePhoneNumber("00");
    expect(res00.success).toBe(false);
  });
});
