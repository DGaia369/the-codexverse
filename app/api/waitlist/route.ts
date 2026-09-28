import { NextResponse } from 'next/server';
import {
  isValidEmail,
  isWaitlistPlacement,
  normalizeEmail,
  recordWaitlistInterest,
} from '@/utils/waitlist';

// POST /api/waitlist  { email, placement }
//
// Launch Sprint 2, Part A. Records interest only; creates no auth user, no
// entitlement, and no ReMEMBER™ session. A new email and a repeated email
// get the same { ok: true } response, so the route never reveals whether
// an address was already on the list. Errors are sanitized codes; the
// participant-facing wording lives in the form component.
//
// No rate-limiting infrastructure exists in this repository to reuse, and
// none is introduced here (see docs/architecture/commerce.md).

const MAX_BODY_BYTES = 2048;

export async function POST(request: Request) {
  let body: unknown;

  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }

  const { email, placement } = (body ?? {}) as { email?: unknown; placement?: unknown };

  if (!isWaitlistPlacement(placement)) {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }

  if (typeof email !== 'string' || !isValidEmail(normalizeEmail(email))) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  try {
    await recordWaitlistInterest({ email, placement });
  } catch {
    // Already logged inside the service, without the email address.
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
