import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { getActiveSessionForUser, saveMovementResponse } from '@/utils/remember';

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
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ ok: false, error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { promptKey, responseText } = body;

    const session = await getActiveSessionForUser(user.id);

    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'No active ReMEMBER session' },
        { status: 404 }
      );
    }

    const saveResult = await saveMovementResponse({
      userId: user.id,
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
