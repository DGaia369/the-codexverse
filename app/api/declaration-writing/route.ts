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

// GET — load existing declaration writing record by session_id
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('declarations')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ declaration: data });
}

// POST — create a new draft record on first arrival (idempotent by session_id)
// session_id now carries a unique constraint at the database level. The
// upsert below inserts only when no row exists for this session, and skips
// silently on conflict — it never overwrites an existing row, so a record
// that has already been sealed can never be reset back to draft by a
// duplicate POST. A final select returns whichever row is authoritative,
// whether it was just created or already existed.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, email } = body;

  if (!session_id) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  const supabase = getSupabaseClient();

  const { error: upsertError } = await supabase
    .from('declarations')
    .upsert(
      { session_id, email, status: 'draft' },
      { onConflict: 'session_id', ignoreDuplicates: true }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('declarations')
    .select('*')
    .eq('session_id', session_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ declaration: data });
}

// PATCH — autosave fields, or seal the declaration when seal: true is passed
const WRITABLE_FIELDS = [
  'p1_q1', 'p1_q2',
  'p2_q1', 'p2_q2', 'p2_q3',
  'p3_q1', 'p3_q2',
  'p4_q1', 'p4_q2', 'p4_q3',
  'p5_q1', 'p5_q2', 'p5_q3', 'p5_q4', 'p5_q5',
];

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { session_id, seal } = body;

  if (!session_id) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  const supabase = getSupabaseClient();

  // Confirm the record exists and is not already sealed before allowing any write
  const { data: existing, error: fetchError } = await supabase
    .from('declarations')
    .select('status')
    .eq('session_id', session_id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ error: 'No declaration record found for this session' }, { status: 404 });
  }

  if (existing.status === 'sealed') {
    return NextResponse.json({ error: 'This Declaration has already been sealed and cannot be edited' }, { status: 403 });
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // Only accept whitelisted writable fields — never let arbitrary keys through
  for (const field of WRITABLE_FIELDS) {
    if (field in body) {
      updatePayload[field] = body[field];
    }
  }

  if (seal === true) {
    updatePayload.status = 'sealed';
    updatePayload.sealed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('declarations')
    .update(updatePayload)
    .eq('session_id', session_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ declaration: data });
}