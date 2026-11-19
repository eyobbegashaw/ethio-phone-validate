# ethio-phone-validate

> Enterprise-grade, zero-dependency TypeScript library for validating, parsing, normalizing, formatting, and identifying Ethiopian mobile phone numbers.

[![CI](https://github.com/eyobbegashaw/Ready-Real-Time-Collaboration-Tool/actions/workflows/ci.yml/badge.svg)](https://github.com/eyobbegashaw/Ready-Real-Time-Collaboration-Tool/actions)
[![npm version](https://img.shields.io/npm/v/ethio-phone-validate.svg)](https://www.npmjs.com/package/ethio-phone-validate)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)]()
[![Tree Shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen.svg)]()

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Ethiopian Numbering Plan Specification](#ethiopian-numbering-plan-specification)
- [Supported Formats](#supported-formats)
- [API Reference](#api-reference)
  - [`isValidPhoneNumber`](#isvalidphonenumber)
  - [`validatePhoneNumber`](#validatephonenumber)
  - [`formatPhoneNumber`](#formatphonenumber)
  - [`normalizePhoneNumber`](#normalizephonenumber)
  - [`getPhoneOperator`](#getphoneoperator)
  - [`isEthioTelecom` & `isSafaricom`](#isethiotelecom--issafaricom)
- [Error Codes](#error-codes)
- [Framework Integrations](#framework-integrations)
  - [Next.js App Router](#nextjs-app-router)
  - [Express.js](#expressjs)
  - [React Component](#react-component)
- [Security & ReDoS Protection](#security--redos-protection)
- [Development & Testing](#development--testing)
- [License](#license)

---

## Overview

Ethiopian telecommunications adhere to the **ITU-T Recommendation E.164** standard and the **National Numbering Plan Directive (No. 795/2021)** established by the **Ethiopian Communications Authority (ECA)**.

`ethio-phone-validate` provides strict validation, canonical normalization, display formatting, and telecommunications operator attribution for Ethiopian mobile subscribers across **Ethio Telecom** and **Safaricom Ethiopia**.

---

## Key Features

- **Authoritative & Standards-Compliant**: Verified against ITU-T E.164 and Ethiopian Communications Authority numbering directives.
- **Operator Identification**: Identifies Ethio Telecom (`09...`) and Safaricom Ethiopia (`07...`) prefixes.
- **Multiple Output Formats**: Supports E.164 (`+251912345678`), National (`0912345678`), Display (`+251 91 234 5678`), and RFC 3966 (`tel:+251-91-234-5678`).
- **Flexible Input Sanitization**: Handles user variations such as `+251 (0) 912 345 678`, `+251-91-234-5678`, spaces, hyphens, and dots.
- **ReDoS Protected**: Guarantees $O(n)$ deterministic parsing with bounded input length guards ($< 50$ chars).
- **Zero Runtime Dependencies**: Ultra-lightweight footprint without bloating your `node_modules` or bundle.
- **Strict TypeScript**: Includes comprehensive `.d.ts` type definitions, readonly interfaces, and discriminated unions.
- **Dual ESM & CommonJS**: Built with `tsup` for universal compatibility across Node.js, Next.js, Vite, and modern browsers.

---

## Installation

```bash
# npm
npm install ethio-phone-validate

# yarn
yarn add ethio-phone-validate

# pnpm
pnpm add ethio-phone-validate
```

---

## Quick Start

```ts
import {
  isValidPhoneNumber,
  validatePhoneNumber,
  formatPhoneNumber,
  normalizePhoneNumber,
  getPhoneOperator,
} from "ethio-phone-validate";

// 1. Quick boolean check
isValidPhoneNumber("0912345678"); // true
isValidPhoneNumber("+254712345678"); // false (Kenya country code)

// 2. Comprehensive metadata validation
const result = validatePhoneNumber("0912-345-678");
console.log(result);
/*
{
  valid: true,
  country: "ET",
  countryCallingCode: "+251",
  nationalNumber: "912345678",
  internationalNumber: "+251912345678",
  localNumber: "0912345678",
  operator: "Ethio Telecom",
  operatorCode: "ETHIO_TELECOM",
  formatted: "+251 91 234 5678",
  type: "mobile",
  errors: []
}
*/

// 3. Format numbers for UI display
formatPhoneNumber("0912345678"); // "+251 91 234 5678"
formatPhoneNumber("0912345678", { format: "national" }); // "0912345678"

// 4. Normalize for database storage
normalizePhoneNumber("0912 345 678"); // "+251912345678"

// 5. Operator attribution
const operator = getPhoneOperator("+251701234567");
console.log(operator?.name); // "Safaricom Ethiopia"
```

---

## Ethiopian Numbering Plan Specification

| Parameter | Value | Notes |
|:---|:---|:---|
| **Country Code** | `+251` | ITU-T E.164 standard calling code |
| **National Trunk Prefix** | `0` | Preprended when dialing domestically |
| **International Prefix** | `00` | E.164 international exit code |
| **National Significant Number (NSN)** | 9 digits | Significant digits excluding `+251` or trunk `0` |
| **Domestic Mobile Length** | 10 digits | `0` + 9 NSN digits (e.g. `09XXXXXXXX`, `07XXXXXXXX`) |
| **International Mobile Length** | 13 chars | `+251` + 9 NSN digits (e.g. `+251XXXXXXXXX`) |

### Operator Allocations

| Operator | Brand | NDC | National Prefixes |
|:---|:---|:---|:---|
| **Ethio Telecom** | Ethio Telecom | `9` | `090`, `091`, `092`, `093`, `094`, `095`, `096`, `097`, `098`, `099` |
| **Safaricom Ethiopia** | Safaricom Ethiopia | `7` | `070`, `071`, `072`, `074`, `077`, `078`, `079` |
| **Fixed-line (PSTN)** | Ethio Telecom | `1`-`6` | `011` (Addis Ababa), `022`, `025`, `033`, `046`, `058` |

> *Note: By default, `ethio-phone-validate` strictly enforces mobile numbers. Geographic fixed-line numbers can be optionally enabled using `{ allowFixedLines: true }`.*

---

## Supported Formats

The parser automatically accepts and canonicalizes standard user variations:

- **Domestic local**: `0912345678`, `0701234567`
- **International E.164**: `+251912345678`, `+251701234567`
- **International with exit code**: `00251912345678`
- **Bare NSN (without trunk)**: `912345678`, `701234567`
- **Formatted with punctuation**: `+251 91 234 5678`, `0912-345-678`, `(0912) 345 678`
- **Redundant trunk notations**: `+251 (0) 912 345 678`, `+2510912345678`

---

## API Reference

### `isValidPhoneNumber`

Performs a boolean validation check.

```ts
function isValidPhoneNumber(input: unknown, options?: ValidationOptions): boolean;
```

```ts
isValidPhoneNumber("0912345678"); // true
isValidPhoneNumber("0701234567"); // true
isValidPhoneNumber("+254712345678"); // false (Kenya)
isValidPhoneNumber("0812345678"); // false (Unsupported prefix)
isValidPhoneNumber("0112345678"); // false (Fixed-line rejected by default)
isValidPhoneNumber("0112345678", { allowFixedLines: true }); // true
```

---

### `validatePhoneNumber`

Returns detailed validation metadata and structured errors. Never throws exceptions.

```ts
function validatePhoneNumber(input: unknown, options?: ValidationOptions): ValidationResult;
```

#### Return Type (`ValidationResult`)

When valid:
```ts
interface ValidationSuccessResult {
  valid: true;
  country: "ET";
  countryCallingCode: "+251";
  nationalNumber: string;         // e.g. "912345678"
  internationalNumber: string;    // e.g. "+251912345678"
  localNumber: string;            // e.g. "0912345678"
  operator: "Ethio Telecom" | "Safaricom Ethiopia" | "Unknown";
  operatorCode: "ETHIO_TELECOM" | "SAFARICOM" | "UNKNOWN";
  formatted: string;              // e.g. "+251 91 234 5678"
  type: "mobile" | "fixed_line" | "unknown";
  errors: [];
}
```

When invalid:
```ts
interface ValidationFailureResult {
  valid: false;
  country: null;
  countryCallingCode: null;
  nationalNumber: null;
  internationalNumber: null;
  localNumber: null;
  operator: null;
  operatorCode: null;
  formatted: null;
  type: null;
  errors: ValidationError[];
}
```

---

### `formatPhoneNumber`

Formats an Ethiopian phone number into standard representations. Returns `null` if the number is invalid.

```ts
function formatPhoneNumber(input: unknown, options?: FormatOptions): string | null;
```

```ts
// Display (default): "+251 91 234 5678"
formatPhoneNumber("0912345678");

// National: "0912345678"
formatPhoneNumber("+251912345678", { format: "national" });

// International (E.164): "+251912345678"
formatPhoneNumber("0912345678", { format: "international" });

// RFC 3966: "tel:+251-91-234-5678"
formatPhoneNumber("0912345678", { format: "rfc3966" });

// Custom separator
formatPhoneNumber("0912345678", { separator: "-" }); // "+251-91-234-5678"
```

---

### `normalizePhoneNumber`

Converts any valid Ethiopian phone number representation into a canonical string. Defaults to E.164 (`+2519XXXXXXXX`). Returns `null` if the input is invalid.

```ts
function normalizePhoneNumber(input: unknown, options?: FormatOptions): string | null;
```

```ts
normalizePhoneNumber("0912-345-678"); // "+251912345678"
normalizePhoneNumber("0701 234 567", { format: "national" }); // "0701234567"
normalizePhoneNumber("invalid"); // null
```

---

### `getPhoneOperator`

Returns information about the telecommunications operator owning the prefix range.

```ts
function getPhoneOperator(input: unknown): OperatorInfo | null;
```

```ts
const op = getPhoneOperator("0911234567");
/*
{
  code: "ETHIO_TELECOM",
  name: "Ethio Telecom",
  brand: "Ethio Telecom",
  prefixes: ["90", "91", "92", ...]
}
*/
```

---

### `isEthioTelecom` & `isSafaricom`

Boolean helpers for operator checks:

```ts
isEthioTelecom("0912345678"); // true
isEthioTelecom("0701234567"); // false

isSafaricom("0701234567"); // true
isSafaricom("0912345678"); // false
```

---

## Error Codes

When a phone number fails validation, `result.errors` contains descriptive error objects with stable error codes:

| Error Code | Description |
|:---|:---|
| `EMPTY_INPUT` | Input is null, undefined, empty, or not a string. |
| `INVALID_CHARACTERS` | Contains non-permissible symbols or misplaced plus signs. |
| `TOO_LONG` | Input exceeds maximum safe length (50 chars) to prevent ReDoS. |
| `INVALID_COUNTRY_CODE` | Number starts with a non-Ethiopian calling code (e.g. `+254`, `+1`). |
| `INVALID_LENGTH` | National Significant Number does not contain exactly 9 digits. |
| `INVALID_PREFIX` | Number does not begin with an Ethiopian mobile code (`09` or `07`). |
| `UNSUPPORTED_TYPE` | Number is an Ethiopian fixed-line number and `allowFixedLines` is `false`. |
| `UNKNOWN_OPERATOR` | Prefix is not registered to an officially authorized operator. |

---

## Framework Integrations

### Next.js App Router

```ts
// app/api/verify-phone/route.ts
import { NextResponse } from "next/server";
import { validatePhoneNumber, normalizePhoneNumber } from "ethio-phone-validate";

export async function POST(req: Request) {
  const { phone } = await req.json();
  const validation = validatePhoneNumber(phone);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid Ethiopian phone number", details: validation.errors },
      { status: 400 },
    );
  }

  const canonical = normalizePhoneNumber(phone);
  return NextResponse.json({
    success: true,
    phone: canonical,
    operator: validation.operator,
  });
}
```

### Express.js

```ts
import express from "express";
import { isValidPhoneNumber, normalizePhoneNumber, getPhoneOperator } from "ethio-phone-validate";

const app = express();
app.use(express.json());

app.post("/api/register", (req, res) => {
  const { phoneNumber } = req.body;

  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({ error: "Invalid Ethiopian mobile number" });
  }

  const normalized = normalizePhoneNumber(phoneNumber);
  const operator = getPhoneOperator(phoneNumber);

  res.json({ success: true, phone: normalized, operator: operator?.name });
});
```

### React Component

```tsx
import React, { useState } from "react";
import { validatePhoneNumber, formatPhoneNumber } from "ethio-phone-validate";

export function PhoneInputField() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);

    if (!input.trim()) {
      setError(null);
      setOperator(null);
      return;
    }

    const res = validatePhoneNumber(input);
    if (res.valid) {
      setError(null);
      setOperator(res.operator);
    } else {
      setError(res.errors[0]?.message ?? "Invalid phone number");
      setOperator(null);
    }
  };

  return (
    <div>
      <label htmlFor="phone">Ethiopian Mobile Number</label>
      <input
        id="phone"
        type="tel"
        placeholder="0912 345 678 or 0701 234 567"
        value={value}
        onChange={handleChange}
      />
      {operator && <span className="badge">{operator}</span>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

## Security & ReDoS Protection

- **ReDoS Prevention**: Does not use nested quantifier regular expressions. String parsing executes in deterministic $O(n)$ time.
- **Length Bounds**: Rejects inputs longer than 50 characters before evaluation, preventing buffer exhaustion.
- **Data Privacy**: No telemetry, no network calls, and no logging of users' sensitive telephone records.
- **Immutable Types**: Readonly data structures prevent prototype mutation and side-effects.

---

## Development & Testing

```bash
# Clone the repository
git clone https://github.com/eyobbegashaw/Ready-Real-Time-Collaboration-Tool.git
cd Ready-Real-Time-Collaboration-Tool

# Install dependencies
npm install

# Run unit tests
npm test

# Run tests with 100% coverage reporting
npm run test:coverage

# Typecheck TypeScript
npm run typecheck

# Build dual ESM/CommonJS distribution
npm run build
```

---

## License

MIT © [Eyob Begashaw](https://github.com/eyobbegashaw)
