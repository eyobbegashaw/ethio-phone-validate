import { describe, expect, it } from "vitest";
import { isValidPhoneNumber, validatePhoneNumber } from "../src/index.js";

describe("Security & ReDoS Protection", () => {
  it("should reject inputs exceeding safe length threshold instantly without ReDoS", () => {
    const maliciousLongInputs = [
      "09" + "1".repeat(500),
      "+251" + "9".repeat(1000),
      " " + "0".repeat(5000) + " ",
      "+251-91-" + "2".repeat(10000),
    ];

    for (const input of maliciousLongInputs) {
      const startTime = performance.now();
      const res = validatePhoneNumber(input);
      const duration = performance.now() - startTime;

      expect(res.valid).toBe(false);
      expect(res.errors[0]?.code).toBe("TOO_LONG");
      expect(duration).toBeLessThan(10); // Must terminate in < 10ms
    }
  });

  it("should safely handle SQL and Script injection attempts", () => {
    const injectionPayloads = [
      "0912345678'; DROP TABLE users; --",
      "<script>alert('xss')</script>0912345678",
      "0912345678\x00malicious",
      "0912345678\n0987654321",
      "${process.mainModule.require('child_process').execSync('whoami')}",
      "{{7*7}}0912345678",
    ];

    for (const payload of injectionPayloads) {
      expect(isValidPhoneNumber(payload)).toBe(false);
      const res = validatePhoneNumber(payload);
      expect(res.valid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    }
  });

  it("should handle prototype pollution property keys safely", () => {
    const poisonedKeys = ["__proto__", "constructor", "prototype", "toString", "valueOf"];

    for (const key of poisonedKeys) {
      expect(isValidPhoneNumber(key)).toBe(false);
      const res = validatePhoneNumber(key);
      expect(res.valid).toBe(false);
    }
  });
});
