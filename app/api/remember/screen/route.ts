import { NextRequest, NextResponse } from 'next/server';
import { getActiveSessionForUser, advanceRememberScreen } from '@/utils/remember';
import { authorizeRememberAccess } from '@/utils/authorization';

// The client never supplies a remember_session_id. The caller's own active
// session is always resolved server-side from the authenticated user, so
// there is nothing for a client to spoof.
//
// screenKey and viewedScreenKey are both validated server-side against the
// session's actual current_screen_key by advanceRememberScreen: screenKey
// must be the next screen in the Founder-locked sequence, and
// viewedScreenKey (when supplied) must equal the session's current screen.
// Reaching the post-closing transition screen also triggers the Movement
// One completion check.
export async function PATCH(req: NextRequest) {
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
    const { screenKey, viewedScreenKey } = body;

    const session = await getActiveSessionForUser(userId);

    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'No active ReMEMBER session' },
        { status: 404 }
      );
    }

    const result = await advanceRememberScreen({
      userId,
      rememberSessionId: session.id,
      screenKey,
      viewedScreenKey,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, complete: result.complete ?? false });
  } catch (err) {
    console.error('ReMEMBER screen route error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error updating screen state' },
      { status: 500 }
    );
  }
}
