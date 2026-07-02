import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
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

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('returns')
      .select(
        'q1_completed, q2_resistance, q3_changed, q4_truth_revealed, q5_non_negotiable'
      )
      .eq('session_id', sessionId)
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