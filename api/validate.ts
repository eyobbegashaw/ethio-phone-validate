import type { IncomingMessage, ServerResponse } from "http";
import { formatPhoneNumber, normalizePhoneNumber, validatePhoneNumber } from "../dist/index.js";

interface VercelRequest extends IncomingMessage {
  query?: Record<string, string | string[]>;
  body?: unknown;
}

export default async function handler(req: VercelRequest, res: ServerResponse): Promise<void> {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  let phoneInput: unknown = null;

  if (req.method === "GET") {
    // Parse query string from URL
    const url = new URL(req.url ?? "", "http://localhost");
    phoneInput = url.searchParams.get("phone") ?? url.searchParams.get("number");
  } else if (req.method === "POST") {
    // Parse JSON body if present
    if (typeof req.body === "object" && req.body !== null) {
      const b = req.body as Record<string, unknown>;
      phoneInput = b["phone"] ?? b["number"] ?? b["phoneNumber"];
    } else {
      // Read stream
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const rawBody = Buffer.concat(chunks).toString("utf-8");
      try {
        const parsed = JSON.parse(rawBody);
        phoneInput = parsed.phone ?? parsed.number ?? parsed.phoneNumber;
      } catch {
        phoneInput = rawBody.trim();
      }
    }
  }

  if (!phoneInput) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: "Missing required 'phone' parameter. Example: /api/validate?phone=0912345678",
      }),
    );
    return;
  }

  const result = validatePhoneNumber(phoneInput);
  const normalized = normalizePhoneNumber(phoneInput);
  const formattedDisplay = formatPhoneNumber(phoneInput, { format: "display" });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify(
      {
        success: true,
        data: {
          ...result,
          normalized,
          formattedDisplay,
        },
      },
      null,
      2,
    ),
  );
}
