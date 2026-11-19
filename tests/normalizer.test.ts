import { describe, expect, it } from "vitest";
import { normalizePhoneNumber } from "../src/index.js";

describe("normalizePhoneNumber", () => {
  it("should normalize to E.164 international format by default", () => {
    expect(normalizePhoneNumber("0912-345-678")).toBe("+251912345678");
    expect(normalizePhoneNumber("+251 91 234 5678")).toBe("+251912345678");
    expect(normalizePhoneNumber("912345678")).toBe("+251912345678");
    expect(normalizePhoneNumber("0701-234-567")).toBe("+251701234567");
    expect(normalizePhoneNumber("0912345678", { format: "e164" })).toBe("+251912345678");
  });

  it("should normalize to national format when requested", () => {
    expect(normalizePhoneNumber("+251912345678", { format: "national" })).toBe("0912345678");
    expect(normalizePhoneNumber("912345678", { format: "national" })).toBe("0912345678");
    expect(normalizePhoneNumber("+251 70 123 4567", { format: "national" })).toBe("0701234567");
  });

  it("should normalize to display format when requested", () => {
    expect(normalizePhoneNumber("0912345678", { format: "display" })).toBe("+251 91 234 5678");
    expect(
      normalizePhoneNumber("0912345678", { format: "display", separator: "-" }),
    ).toBe("+251-91-234-5678");
  });

  it("should normalize to rfc3966 format when requested", () => {
    expect(normalizePhoneNumber("0912345678", { format: "rfc3966" })).toBe(
      "tel:+251-91-234-5678",
    );
  });

  it("should return null for invalid inputs", () => {
    expect(normalizePhoneNumber("+254712345678")).toBeNull();
    expect(normalizePhoneNumber("0912345")).toBeNull();
    expect(normalizePhoneNumber("invalid")).toBeNull();
    expect(normalizePhoneNumber(null)).toBeNull();
  });
});
