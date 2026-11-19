import { describe, expect, it } from "vitest";
import {
  getPhoneOperator,
  isEthioTelecom,
  isSafaricom,
  operatorRegistry,
} from "../src/index.js";

describe("Operator Detection", () => {
  describe("getPhoneOperator", () => {
    it("should identify Ethio Telecom numbers", () => {
      const op = getPhoneOperator("0912345678");
      expect(op).not.toBeNull();
      expect(op?.code).toBe("ETHIO_TELECOM");
      expect(op?.name).toBe("Ethio Telecom");
    });

    it("should identify Safaricom Ethiopia numbers", () => {
      const op = getPhoneOperator("0701234567");
      expect(op).not.toBeNull();
      expect(op?.code).toBe("SAFARICOM");
      expect(op?.name).toBe("Safaricom Ethiopia");
    });

    it("should return null for invalid or foreign numbers", () => {
      expect(getPhoneOperator("+254712345678")).toBeNull();
      expect(getPhoneOperator("0912")).toBeNull();
      expect(getPhoneOperator(null)).toBeNull();
    });
  });

  describe("Operator boolean predicates", () => {
    it("isEthioTelecom should return true only for Ethio Telecom numbers", () => {
      expect(isEthioTelecom("0912345678")).toBe(true);
      expect(isEthioTelecom("+251912345678")).toBe(true);
      expect(isEthioTelecom("0701234567")).toBe(false);
      expect(isEthioTelecom("+254712345678")).toBe(false);
      expect(isEthioTelecom(null)).toBe(false);
    });

    it("isSafaricom should return true only for Safaricom Ethiopia numbers", () => {
      expect(isSafaricom("0701234567")).toBe(true);
      expect(isSafaricom("+251711234567")).toBe(true);
      expect(isSafaricom("0912345678")).toBe(false);
      expect(isSafaricom("+254712345678")).toBe(false);
      expect(isSafaricom(null)).toBe(false);
    });
  });

  describe("Operator Registry Extensibility", () => {
    it("should allow querying all registered operators", () => {
      const all = operatorRegistry.getAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
      expect(all.some((o) => o.code === "ETHIO_TELECOM")).toBe(true);
      expect(all.some((o) => o.code === "SAFARICOM")).toBe(true);
    });

    it("should allow registering a new operator or future MVNO", () => {
      operatorRegistry.register({
        code: "UNKNOWN",
        name: "Unknown",
        brand: "Mock Future Operator",
        prefixes: ["88"],
      });
      const detected = operatorRegistry.detectByPrefix("88");
      expect(detected.brand).toBe("Mock Future Operator");
    });
  });
});
