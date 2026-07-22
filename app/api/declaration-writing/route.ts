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

// GET — load the Declaration™ writing record.
// If a legacy session has no declarations row yet, create one safely.
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Return the existing authoritative record without modifying it.
    const { data: existing, error: existingError } = await supabase
      .from('declarations')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existingError) {
      console.error('Declaration lookup failed:', existingError);

      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({ declaration: existing });
    }

    // Recover the participant email from the matching Return session.
    const { data: returnRow, error: returnError } = await supabase
      .from('returns')
      .select('email')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (returnError) {
      console.error('Return lookup failed:', returnError);

      return NextResponse.json(
        { error: returnError.message },
        { status: 500 }
      );
    }

    if (!returnRow?.email) {
      return NextResponse.json(
        { error: 'No completed Return record was found for this session' },
        { status: 404 }
      );
    }

    // Safe under the session_id unique constraint.
    // ignoreDuplicates prevents an existing draft or sealed record from being overwritten.
    const { error: upsertError } = await supabase
      .from('declarations')
      .upsert(
        {
          session_id: sessionId,
          email: returnRow.email.toLowerCase(),
          status: 'draft',
        },
        {
          onConflict: 'session_id',
          ignoreDuplicates: true,
        }
      );

    if (upsertError) {
      console.error('Declaration draft creation failed:', upsertError);

      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      );
    }

    // Read the authoritative row after the safe upsert.
    const { data: declaration, error: readError } = await supabase
      .from('declarations')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (readError) {
      console.error('Declaration read-after-create failed:', readError);

      return NextResponse.json(
        { error: readError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ declaration });
  } catch (error) {
    console.error('Declaration GET unexpected error:', error);

    return NextResponse.json(
      { error: 'Unexpected error loading the Declaration' },
      { status: 500 }
    );
  }
}

// POST — create a new draft record on first arrival.
// Idempotent by session_id. Existing draft or sealed rows are never overwritten.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, email } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { error: upsertError } = await supabase
      .from('declarations')
      .upsert(
        {
          session_id,
          email: typeof email === 'string' ? email.toLowerCase() : null,
          status: 'draft',
        },
        {
          onConflict: 'session_id',
          ignoreDuplicates: true,
        }
      );

    if (upsertError) {
      console.error('Declaration POST upsert failed:', upsertError);

      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('declarations')
      .select('*')
      .eq('session_id', session_id)
      .single();

    if (error) {
      console.error('Declaration POST read failed:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ declaration: data });
  } catch (error) {
    console.error('Declaration POST unexpected error:', error);

    return NextResponse.json(
      { error: 'Unexpected error creating the Declaration' },
      { status: 500 }
    );
  }
}

// PATCH — autosave fields, or seal the Declaration™ when seal: true is passed.
const WRITABLE_FIELDS = [
  'p1_q1',
  'p1_q2',
  'p2_q1',
  'p2_q2',
  'p2_q3',
  'p3_q1',
  'p3_q2',
  'p4_q1',
  'p4_q2',
  'p4_q3',
  'p5_q1',
  'p5_q2',
  'p5_q3',
  'p5_q4',
  'p5_q5',
] as const;

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, seal } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Confirm the record exists and is not already sealed before allowing any write.
    const { data: existing, error: fetchError } = await supabase
      .from('declarations')
      .select('status')
      .eq('session_id', session_id)
      .maybeSingle();

    if (fetchError) {
      console.error('Declaration PATCH lookup failed:', fetchError);

      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'No declaration record found for this session' },
        { status: 404 }
      );
    }

    if (existing.status === 'sealed') {
      return NextResponse.json(
        { error: 'This Declaration has already been sealed and cannot be edited' },
        { status: 403 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Accept only whitelisted writing fields.
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
      console.error('Declaration PATCH update failed:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ declaration: data });
  } catch (error) {
    console.error('Declaration PATCH unexpected error:', error);

    return NextResponse.json(
      { error: 'Unexpected error updating the Declaration' },
      { status: 500 }
    );
  }
}