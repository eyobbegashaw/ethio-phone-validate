/**
 * Example: Next.js App Router API Route / Server Action.
 */
import {
  formatPhoneNumber,
  isEthioTelecom,
  isSafaricom,
  normalizePhoneNumber,
  validatePhoneNumber,
} from "../src/index.js";

export async function POST(request: { json: () => Promise<{ phone?: string }> }) {
  const body = await request.json();
  const rawPhone = body.phone;

  const result = validatePhoneNumber(rawPhone);

  if (!result.valid) {
    return {
      status: 422,
      body: {
        error: "Invalid Ethiopian phone number",
        details: result.errors,
      },
    };
  }

  // Determine routing or SMS gateway provider based on operator
  const isEthio = isEthioTelecom(rawPhone);
  const isSaf = isSafaricom(rawPhone);

  const normalized = normalizePhoneNumber(rawPhone); // "+251912345678"
  const formatted = formatPhoneNumber(rawPhone, { format: "display" }); // "+251 91 234 5678"

  return {
    status: 200,
    body: {
      success: true,
      phone: normalized,
      display: formatted,
      operator: result.operator,
      gateway: isEthio ? "ethio-telecom-bulk-sms" : isSaf ? "safaricom-mpesa-api" : "default",
    },
  };
}
