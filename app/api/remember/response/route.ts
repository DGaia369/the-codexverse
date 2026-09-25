import { NextRequest, NextResponse } from 'next/server';
import { getActiveSessionForUser, saveMovementResponse } from '@/utils/remember';
import { authorizeRememberAccess } from '@/utils/authorization';

// The client never supplies a remember_session_id. The caller's own active
// session is always resolved server-side from the authenticated user, so
// there is nothing for a client to spoof.
//
// This route only saves a response (used for autosave and for the explicit
// Continue action on a writing screen), always into the session's own
// current movement. It never evaluates or writes movement completion;
// completion is evaluated exclusively by PATCH /api/remember/screen when the
// session validly advances past a movement's closing screen (m1_closing to
// m1_to_m2 for Movement One, m2_closing to m2_to_m3 for Movement Two).
export async function POST(req: NextRequest) {
  try {
    // Re-evaluated on every request. Participant identity comes only from
    // the authenticated Supabase session resolved inside
    // authorizeRememberAccess(); the userId it returns is the sole identity
    // used below. Operational failures (database/product lookup) throw and
    // reach the 500 handler, so they stay distinct from a legitimate
    // denial. A denial never reaches a ReMEMBER™ read or write.
    const authorization = await authorizeRememberAccess();

    if (!authorization.authorized) {
      if (!authorization.eligible && authorization.reason === 'unauthenticated') {
        return NextResponse.json({ ok: false, error: 'Unauthenticated' }, { status: 401 });
      }

      return NextResponse.json(
        { ok: false, error: 'Not authorized' },
        { status: 403 }
      );
    }

    const userId = authorization.userId;

    const body = await req.json();
    const { promptKey, responseText } = body;

    const session = await getActiveSessionForUser(userId);

    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'No active ReMEMBER session' },
        { status: 404 }
      );
    }

    const saveResult = await saveMovementResponse({
      userId,
      rememberSessionId: session.id,
      promptKey,
      responseText,
    });

    if (!saveResult.ok) {
      return NextResponse.json({ ok: false, error: saveResult.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('ReMEMBER response route error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error saving response' },
      { status: 500 }
    );
  }
}
