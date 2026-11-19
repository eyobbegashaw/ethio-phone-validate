import { describe, expect, it } from "vitest";
import { formatNationalDisplay, formatPhoneNumber } from "../src/index.js";

describe("formatPhoneNumber", () => {
  it("should format to display format by default", () => {
    expect(formatPhoneNumber("0912345678")).toBe("+251 91 234 5678");
    expect(formatPhoneNumber("+251701234567")).toBe("+251 70 123 4567");
  });

  it("should format with custom separator", () => {
    expect(formatPhoneNumber("0912345678", { separator: "-" })).toBe("+251-91-234-5678");
  });

  it("should format to national format", () => {
    expect(formatPhoneNumber("+251912345678", { format: "national" })).toBe("0912345678");
  });

  it("should format to international E.164 format", () => {
    expect(formatPhoneNumber("0912345678", { format: "international" })).toBe("+251912345678");
  });

  it("should format to rfc3966 format", () => {
    expect(formatPhoneNumber("0912345678", { format: "rfc3966" })).toBe(
      "tel:+251-91-234-5678",
    );
  });

  it("should return null for invalid numbers", () => {
    expect(formatPhoneNumber("12345")).toBeNull();
    expect(formatPhoneNumber(null)).toBeNull();
  });
});

describe("formatNationalDisplay", () => {
  it("should format into domestic readable grouping", () => {
    expect(formatNationalDisplay("0912345678")).toBe("091 234 5678");
    expect(formatNationalDisplay("+251701234567")).toBe("070 123 4567");
    expect(formatNationalDisplay("0912345678", "-")).toBe("091-234-5678");
  });

  it("should return null for invalid numbers", () => {
    expect(formatNationalDisplay("+254712345678")).toBeNull();
  });
});
