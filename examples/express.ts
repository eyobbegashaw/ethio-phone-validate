/**
 * Example: Using `ethio-phone-validate` in an Express.js Application.
 */
import {
  formatPhoneNumber,
  getPhoneOperator,
  isValidPhoneNumber,
  validatePhoneNumber,
} from "../src/index.js";

// Mock Express-like request and response types for standalone type-safety
interface Request {
  body: {
    phoneNumber?: string;
  };
}

interface Response {
  status: (code: number) => Response;
  json: (data: unknown) => void;
}

export function registerUserHandler(req: Request, res: Response): void {
  const { phoneNumber } = req.body;

  // 1. Quick boolean validation check
  if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
    res.status(400).json({
      success: false,
      error: "Please provide a valid Ethiopian mobile phone number (Ethio Telecom or Safaricom).",
    });
    return;
  }

  // 2. Structured metadata extraction
  const validation = validatePhoneNumber(phoneNumber);
  if (!validation.valid) {
    res.status(400).json({
      success: false,
      errors: validation.errors,
    });
    return;
  }

  // 3. Normalized storage and formatted display
  const operator = getPhoneOperator(phoneNumber);

  res.status(200).json({
    success: true,
    data: {
      canonicalE164: validation.internationalNumber, // e.g. "+251912345678"
      nationalFormat: validation.localNumber, // e.g. "0912345678"
      displayFormat: formatPhoneNumber(phoneNumber), // e.g. "+251 91 234 5678"
      operator: operator?.name, // "Ethio Telecom" or "Safaricom Ethiopia"
      operatorCode: operator?.code,
    },
  });
}
