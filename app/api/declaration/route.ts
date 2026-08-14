import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase/server';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

// Ownership: the authenticated participant's email (server-verified via
// auth.getUser(), never client-supplied) must match the `returns.email` row
// for the requested session_id — the same ownership relationship already
// used by app/api/declaration-writing/route.ts and
// app/api/declaration/pdf/route.ts. A session that does not exist and a
// session owned by someone else are deliberately indistinguishable to the
// caller.
async function getAuthenticatedEmail(): Promise<string | null> {
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  return user?.email ? user.email.toLowerCase() : null;
}

async function verifyOwnership(
  supabase: ReturnType<typeof getSupabaseClient>,
  sessionId: string,
  email: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('returns')
    .select('session_id')
    .eq('session_id', sessionId)
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Declaration ownership check failed:', error);
    return false;
  }

  return !!data;
}

// GET /api/declaration?session_id=xxx
// Loads the participant's five return answers by session_id.
// Returns null record if none exists.
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: 'session_id is required' },
        { status: 400 }
      );
    }

    const email = await getAuthenticatedEmail();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseClient();

    const owned = await verifyOwnership(supabase, sessionId, email);

    if (!owned) {
      // A session that does not exist and a session owned by someone else
      // return the same response, so this endpoint cannot be used to probe
      // for the existence of another participant's session.
      return NextResponse.json(
        { ok: false, error: 'Declaration record not found' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('returns')
      .select(
        'q1_completed, q2_resistance, q3_changed, q4_truth_revealed, q5_non_negotiable'
      )
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Declaration GET error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to load Declaration record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, record: data ?? null });
  } catch (err) {
    console.error('Declaration GET unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error loading Declaration record' },
      { status: 500 }
    );
  }
}