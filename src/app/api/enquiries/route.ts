import { NextResponse } from "next/server";
import { EnquirySchema } from "@/lib/contact/enquiry-schema";

/**
 * Mock stand-in for CargoDev's `POST /api/public/enquiries`
 * (docs/cargodev-api-integration.md, section 7) — that endpoint, and the
 * Turnstile site key it requires, don't exist yet. When they do, the form
 * should submit browser-direct to the real API (see the section's note on
 * per-visitor rate limits) instead of through this route.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ fieldErrors: {} }, { status: 400 });
  }

  // Honeypot tripped: the real API still returns 202 here so bots can't
  // distinguish a silent drop from a real submission.
  if (typeof (body as { website?: unknown }).website === "string" && (body as { website: string }).website) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const result = EnquirySchema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json({ fieldErrors }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
