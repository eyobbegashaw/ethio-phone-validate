import { describe, expect, it } from "vitest";
import { isValidPhoneNumber, validatePhoneNumber } from "../src/index.js";

describe("validatePhoneNumber & isValidPhoneNumber", () => {
  describe("Valid Ethio Telecom Numbers", () => {
    const ethioTelecomSamples = [
      { input: "0911234567", nsn: "911234567" },
      { input: "0912345678", nsn: "912345678" },
      { input: "0920112233", nsn: "920112233" },
      { input: "0930445566", nsn: "930445566" },
      { input: "0940778899", nsn: "940778899" },
      { input: "0950123456", nsn: "950123456" },
      { input: "0960654321", nsn: "960654321" },
      { input: "0970987654", nsn: "970987654" },
      { input: "0980111222", nsn: "980111222" },
      { input: "0990333444", nsn: "990333444" },
      // International with +251
      { input: "+251911234567", nsn: "911234567" },
      { input: "+251 91 234 5678", nsn: "912345678" },
      { input: "+251-91-234-5678", nsn: "912345678" },
      // International with 00251
      { input: "00251911234567", nsn: "911234567" },
      // Bare NSN
      { input: "911234567", nsn: "911234567" },
      // Redundant trunk in parentheses or after +251
      { input: "+251 (0) 912 345 678", nsn: "912345678" },
      { input: "+2510912345678", nsn: "912345678" },
    ];

    it.each(ethioTelecomSamples)("should validate $input correctly", ({ input, nsn }) => {
      expect(isValidPhoneNumber(input)).toBe(true);

      const result = validatePhoneNumber(input);
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.country).toBe("ET");
        expect(result.countryCallingCode).toBe("+251");
        expect(result.nationalNumber).toBe(nsn);
        expect(result.localNumber).toBe(`0${nsn}`);
        expect(result.internationalNumber).toBe(`+251${nsn}`);
        expect(result.operator).toBe("Ethio Telecom");
        expect(result.operatorCode).toBe("ETHIO_TELECOM");
        expect(result.type).toBe("mobile");
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe("Valid Safaricom Ethiopia Numbers", () => {
    const safaricomSamples = [
      { input: "0701234567", nsn: "701234567" },
      { input: "0712345678", nsn: "712345678" },
      { input: "0720112233", nsn: "720112233" },
      { input: "0740445566", nsn: "740445566" },
      { input: "0770778899", nsn: "770778899" },
      { input: "0780123456", nsn: "780123456" },
      { input: "0790654321", nsn: "790654321" },
      // International format
      { input: "+251701234567", nsn: "701234567" },
      { input: "+251 70 123 4567", nsn: "701234567" },
      { input: "+251-71-234-5678", nsn: "712345678" },
      { input: "00251701234567", nsn: "701234567" },
      // Bare NSN
      { input: "701234567", nsn: "701234567" },
      // With spaces and parens
      { input: "(0701) 234 567", nsn: "701234567" },
      { input: "+251 (0) 701 234 567", nsn: "701234567" },
    ];

    it.each(safaricomSamples)("should validate $input correctly", ({ input, nsn }) => {
      expect(isValidPhoneNumber(input)).toBe(true);

      const result = validatePhoneNumber(input);
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.country).toBe("ET");
        expect(result.countryCallingCode).toBe("+251");
        expect(result.nationalNumber).toBe(nsn);
        expect(result.localNumber).toBe(`0${nsn}`);
        expect(result.internationalNumber).toBe(`+251${nsn}`);
        expect(result.operator).toBe("Safaricom Ethiopia");
        expect(result.operatorCode).toBe("SAFARICOM");
        expect(result.type).toBe("mobile");
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe("Invalid Country Calling Codes", () => {
    const foreignNumbers = [
      { input: "+254712345678", desc: "Kenya (+254)" },
      { input: "+14155552671", desc: "US (+1)" },
      { input: "+447911123456", desc: "UK (+44)" },
      { input: "+252615000000", desc: "Somalia (+252)" },
      { input: "+250788123456", desc: "Rwanda (+250)" },
      { input: "00254712345678", desc: "Kenya with 00" },
      { input: "0014155552671", desc: "US with 00" },
    ];

    it.each(foreignNumbers)("should reject $desc ($input)", ({ input }) => {
      expect(isValidPhoneNumber(input)).toBe(false);

      const result = validatePhoneNumber(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("INVALID_COUNTRY_CODE");
    });
  });

  describe("Invalid Lengths", () => {
    const invalidLengths = [
      { input: "091234567", desc: "Too short local (9 digits with 0, 8 NSN digits)" },
      { input: "09123456789", desc: "Too long local (11 digits with 0, 10 NSN digits)" },
      { input: "+25191234567", desc: "Too short international (8 NSN digits)" },
      { input: "+2519123456789", desc: "Too long international (10 NSN digits)" },
      { input: "91234567", desc: "Too short NSN (8 digits)" },
      { input: "9123456789", desc: "Too long NSN (10 digits)" },
      { input: "+251", desc: "Country code only" },
      { input: "0", desc: "Single zero" },
    ];

    it.each(invalidLengths)("should reject $desc ($input)", ({ input }) => {
      expect(isValidPhoneNumber(input)).toBe(false);

      const result = validatePhoneNumber(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("INVALID_LENGTH");
    });
  });

  describe("Invalid Prefixes and Landlines", () => {
    it("should reject mobile numbers with unsupported prefix (e.g. 08...)", () => {
      const result = validatePhoneNumber("0812345678");
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("INVALID_PREFIX");
    });

    it("should reject unallocated sub-prefixes in strict mode (e.g. 073...)", () => {
      const result = validatePhoneNumber("0731234567");
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("UNKNOWN_OPERATOR");
    });

    it("should allow unallocated sub-prefixes when strictOperatorPrefixes is false", () => {
      const result = validatePhoneNumber("0731234567", { strictOperatorPrefixes: false });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.operatorCode).toBe("UNKNOWN");
        expect(result.operator).toBe("Unknown");
      }
    });

    it("should reject fixed lines (011...) by default", () => {
      const result = validatePhoneNumber("0112345678");
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("UNSUPPORTED_TYPE");
    });

    it("should allow fixed lines when allowFixedLines is true", () => {
      const result = validatePhoneNumber("0112345678", { allowFixedLines: true });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.type).toBe("fixed_line");
        expect(result.nationalNumber).toBe("112345678");
      }
    });
  });

  describe("Empty, Null, and Malformed Inputs", () => {
    it.each([null, undefined, "", "   ", false, 123456789, {}])(
      "should reject empty/null/non-string input: %s",
      (input) => {
        expect(isValidPhoneNumber(input)).toBe(false);
        const result = validatePhoneNumber(input);
        expect(result.valid).toBe(false);
        expect(result.errors[0]?.code).toBe("EMPTY_INPUT");
      },
    );

    it("should reject inputs with letters", () => {
      const result = validatePhoneNumber("09123abc78");
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("INVALID_CHARACTERS");
    });

    it("should reject inputs with illegal symbols", () => {
      const result = validatePhoneNumber("0912345678#");
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("INVALID_CHARACTERS");
    });

    it("should reject misplaced plus signs", () => {
      const result = validatePhoneNumber("0912+345678");
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe("INVALID_CHARACTERS");
    });
  });
});
