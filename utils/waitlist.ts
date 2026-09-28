import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Waitlist service (server-only)
// ---------------------------------------------------------------------------
// A waitlist row records only that an email address asked to be told when
// something opens. It is NOT authentication, eligibility, entitlement, a
// purchase, or a ReMEMBER™ session, and nothing in access control reads it.
// This module never touches auth.users, entitlements, or any remember_*
// table.
//
// SERVER-SIDE ONLY: reads SUPABASE_SERVICE_ROLE_KEY. Same service-role
// pattern as utils/entitlements.ts and utils/remember.ts.

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableOf<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: GenericRelationship[];
};

type WaitlistInterestRow = {
  id: string;
  email: string;
  interest: string;
  source: string;
  status: 'active' | 'withdrawn';
  consent_at: string;
  created_at: string;
};

type Database = {
  public: {
    Tables: {
      waitlist_interests: TableOf<WaitlistInterestRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let serviceClient: SupabaseClient<Database> | null = null;

function getServiceClient(): SupabaseClient<Database> {
  if (!serviceClient) {
    serviceClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return serviceClient;
}

// ---------------------------------------------------------------------------
// Placements
// ---------------------------------------------------------------------------
// The browser names only where the form sits. The interest and source that
// get stored are decided here, so a client cannot write arbitrary values.
// To reuse the waitlist elsewhere, add a placement.
export const WAITLIST_PLACEMENTS = {
  'pathways-remember-card': {
    interest: 'pathway-two-remember',
    source: 'public_pathways_remember_card',
  },
} as const;

export type WaitlistPlacement = keyof typeof WAITLIST_PLACEMENTS;

export function isWaitlistPlacement(value: unknown): value is WaitlistPlacement {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(WAITLIST_PLACEMENTS, value)
  );
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

// Deliberately simple: one @, no whitespace, a dot in the domain, and the
// RFC 5321 length ceiling. Deliverability is not checked.
export function isValidEmail(email: string): boolean {
  return (
    email.length >= 3 &&
    email.length <= 320 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

// ---------------------------------------------------------------------------
// recordWaitlistInterest
// ---------------------------------------------------------------------------
// Idempotent on (email, interest): a repeat submission leaves the original
// row, including its consent_at, untouched. The caller gets no signal about
// whether the email was already present, so the route cannot leak it.
export async function recordWaitlistInterest(params: {
  email: string;
  placement: WaitlistPlacement;
}): Promise<void> {
  const email = normalizeEmail(params.email);
  if (!isValidEmail(email)) {
    throw new Error('recordWaitlistInterest requires a valid email.');
  }

  const { interest, source } = WAITLIST_PLACEMENTS[params.placement];

  const { error } = await getServiceClient()
    .from('waitlist_interests')
    .upsert(
      { email, interest, source, status: 'active' },
      { onConflict: 'email,interest', ignoreDuplicates: true }
    );

  if (error) {
    // code and message only: a constraint error's `details` can contain the
    // failing row, which includes the email address.
    console.error('Waitlist service: insert failed:', {
      code: error.code,
      message: error.message,
    });
    throw new Error('Unable to record waitlist interest.');
  }
}
