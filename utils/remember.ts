import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/utils/supabase/server';

// ---------------------------------------------------------------------------
// Minimal local Database typing (no generated Supabase types exist in this
// repository yet)
// ---------------------------------------------------------------------------
// Diagnosed cause of the original `never` errors: createClient(url, key) was
// called with no Database generic argument at all, so TypeScript could not
// infer any row shape for .from(table).select/insert/update(...); every
// query result collapsed to `never`. app/api/declaration/route.ts and
// app/api/declaration-writing/route.ts do not show this because they type
// their client variable as `any` (`let supabaseClient: any = null`), which
// silences type-checking on every call made through it rather than
// resolving the underlying inference gap. That escape hatch is intentionally
// not used here.
//
// The fix is to supply an explicit, narrow Database type covering only the
// tables and columns this file actually touches, and pass it to
// createClient<Database>(...). Insert/Update are Partial<Row> because every
// column not listed below either has a database default or is never written
// by this file.
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

type ReturnsRow = {
  session_id: string | null;
  email: string;
  q1_completed: string | null;
  created_at: string;
};

type DeclarationStatusRow = {
  session_id: string;
  status: string;
};

type Database = {
  public: {
    Tables: {
      returns: TableOf<ReturnsRow>;
      declarations: TableOf<DeclarationStatusRow>;
      remember_sessions: TableOf<RememberSessionRow>;
      remember_responses: TableOf<RememberResponseRow>;
      remember_movement_progress: TableOf<RememberMovementProgressRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// ---------------------------------------------------------------------------
// Service-role client (server-only)
// ---------------------------------------------------------------------------
// Mirrors the module-level singleton shape already used in
// app/api/declaration-writing/route.ts and app/api/declaration/route.ts
// (a null-checked getter holding one client instance). This module adds
// { persistSession: false, autoRefreshToken: false }, which neither of those
// two files currently sets. SUPABASE_SERVICE_ROLE_KEY must never be exposed
// through NEXT_PUBLIC_*, and this module must never be imported from client
// code.

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
// Movement One identifiers (approved, server-authoritative)
// ---------------------------------------------------------------------------
// Governing document: docs/design-specifications/pathway-two-remember-movement-one-v2.1.md
// (Founder Approved and Locked, verified SHA-256
// ee6042f84070139b786bea93bf4409cd8c8ebcd2cba532db62c2033d32482177).
// Supersedes the Movement One copy previously carried in this file, which
// mirrored docs/design-specifications/pathway-two-remember-v1.0.md, Part
// Three (now marked superseded in that document's own Amendment History).

export const MOVEMENT_ONE_KEY = 'see_the_scattering' as const;

export const MOVEMENT_ONE_CONTENT_VERSION = 'movement_one_v2.1' as const;

// Order matches the Founder-locked v2.1 screen sequence (section 4). The six
// pre-existing key names are preserved exactly, per Founder ruling, though
// the question copy bound to several of them has changed; arrangement_cost
// is the one additive key.
export const MOVEMENT_ONE_PROMPTS = [
  'comfort_responsibility',
  'role_identity',
  'role_capability',
  'role_concealment',
  'quiet_part',
  'role_necessity',
  'arrangement_cost',
] as const;

export type MovementOnePromptKey = (typeof MOVEMENT_ONE_PROMPTS)[number];

// Approved participant-facing copy, from
// docs/design-specifications/pathway-two-remember-movement-one-v2.1.md,
// section 4 (Exact Participant Sequence). Preserved exactly. Do not edit
// without a further Founder-locked revision of that document.
export const MOVEMENT_ONE_PROMPT_COPY: Record<MovementOnePromptKey, string> = {
  comfort_responsibility:
    'What tells you, before anyone has to say it, that something here now needs your attention?',
  role_identity: 'Who do you become next?',
  role_capability:
    'What does this version of you take over so the room, relationship, or situation does not have to carry it in the same way?',
  role_concealment:
    'What do you edit, soften, withhold, postpone, or dim in yourself so this version of you can keep working?',
  quiet_part: 'While you are doing that, what part of you becomes harder to hear?',
  role_necessity:
    'If you stopped adjusting yourself here, what are you afraid you might discover about your place in this room or relationship?',
  arrangement_cost:
    'What has keeping your place here asked you to set aside in yourself?',
};

// Server-side prompt-key -> order map. The client never supplies prompt_order;
// it is always derived here.
export const PROMPT_ORDER: Record<MovementOnePromptKey, number> =
  MOVEMENT_ONE_PROMPTS.reduce((acc, key, index) => {
    acc[key] = index + 1;
    return acc;
  }, {} as Record<MovementOnePromptKey, number>);

function isMovementOnePromptKey(value: unknown): value is MovementOnePromptKey {
  return (
    typeof value === 'string' &&
    (MOVEMENT_ONE_PROMPTS as readonly string[]).includes(value)
  );
}

// ---------------------------------------------------------------------------
// Movement Two identifiers (local Founder build, server-authoritative)
// ---------------------------------------------------------------------------
// Governing document: docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md
// (supersedes the earlier working-copy draft, pathway-two-remember-
// movement-two-v0.1.md, preserved there as provenance). All Movement Two
// participant-facing copy is FOUNDER-LOCKED as of 2026-09-09, with the
// Bedrock question superseded again on 2026-09-10 (see that document's
// Bedrock section for the current ruling and the prior wording preserved
// as provenance).
//
// The seven storage keys below (MOVEMENT_TWO_PROMPTS) predate the locked
// copy and are intentionally NOT renamed to match it: historical
// participant response data already exists under these exact keys, and the
// Founder-locked correction package of 2026-09-09 explicitly rules that key
// renaming must never be a blocker and must never require a data
// migration. Participant-facing copy is authoritative regardless of
// internal key naming. The mapping below records which locked question
// each key now corresponds to.
//
// room_identity              -> "When nobody needs anything from you, what changes in you?"
// genuinely_mine             -> "When the time is yours, what do you reach for?"
// role_requirement           -> "What did people come to count on you for?"
// harder_to_bring            -> "What would you miss about being that person?"
// mine_without_expectation   -> "What wouldn't you miss?"
// uncertain_without_role     -> "If you didn't have to be that person anymore, what would still feel like you?"
// bedrock_response           -> "What do you know now?" (superseded 2026-09-10; previously "Looking at your own words, what feels like yours, and what feels like what was expected of you?")

export const MOVEMENT_TWO_KEY = 'separate_self_from_role' as const;

export const MOVEMENT_TWO_CONTENT_VERSION = 'movement_two_v0.1' as const;

// Order matches the working sequence in the governing document: six writing
// moments, then the Bedrock response. Unlike Movement One's view-only
// Bedrock, Movement Two's Bedrock response is saved, per Founder
// instruction, so it is included here as a seventh prompt key.
export const MOVEMENT_TWO_PROMPTS = [
  'room_identity',
  'genuinely_mine',
  'role_requirement',
  'harder_to_bring',
  'mine_without_expectation',
  'uncertain_without_role',
  'bedrock_response',
] as const;

export type MovementTwoPromptKey = (typeof MOVEMENT_TWO_PROMPTS)[number];

// Founder-locked participant-facing copy, from
// docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md.
// Preserved exactly. Do not reword, add helper text, or add interpretation
// without a further Founder ruling.
export const MOVEMENT_TWO_PROMPT_COPY: Record<MovementTwoPromptKey, string> = {
  room_identity: 'When nobody needs anything from you, what changes in you?',
  genuinely_mine: 'When the time is yours, what do you reach for?',
  role_requirement: 'What did people come to count on you for?',
  harder_to_bring: 'What would you miss about being that person?',
  mine_without_expectation: 'What wouldn’t you miss?',
  uncertain_without_role:
    'If you didn’t have to be that person anymore, what would still feel like you?',
  bedrock_response: 'What do you know now?',
};

export const MOVEMENT_TWO_PROMPT_ORDER: Record<MovementTwoPromptKey, number> =
  MOVEMENT_TWO_PROMPTS.reduce((acc, key, index) => {
    acc[key] = index + 1;
    return acc;
  }, {} as Record<MovementTwoPromptKey, number>);

function isMovementTwoPromptKey(value: unknown): value is MovementTwoPromptKey {
  return (
    typeof value === 'string' &&
    (MOVEMENT_TWO_PROMPTS as readonly string[]).includes(value)
  );
}

// ---------------------------------------------------------------------------
// Entry Threshold copy (approved, locked)
// ---------------------------------------------------------------------------
// From docs/design-specifications/pathway-two-remember-v1.0.md, Part Two.
// Not touched by the Movement One v2.1 revision. Preserved exactly, in
// order. Screen 3 carries an approved pause beat.

export const ENTRY_THRESHOLD_SCREENS = [
  { key: 'entry_01', lines: ['You found yourself.'] },
  { key: 'entry_02', lines: ['Now something else is asking to be seen.'] },
  {
    key: 'entry_03',
    lines: [
      'Not who you are.',
      'Where you have been leaving pieces of yourself behind.',
    ],
    pauseAfter: true,
  },
  {
    key: 'entry_04',
    lines: [
      'Some parts of you learned to live inside roles created for other people’s comfort.',
    ],
  },
  { key: 'entry_05', lines: ['This is where you begin bringing them home.'] },
] as const;

// ---------------------------------------------------------------------------
// Allowed internal screen keys (server-authoritative, never participant-facing
// progress tracking; these are resume checkpoints only)
// ---------------------------------------------------------------------------
// The seventeen keys below are the exact Screen Key values given in
// docs/design-specifications/pathway-two-remember-movement-one-v2.1.md,
// section 4 (Exact Participant Sequence), in order. Reusing the document's
// own key names, rather than inventing new ones, keeps this file directly
// traceable against the Founder-locked table.

export const MOVEMENT_ONE_SCREEN_KEYS = [
  'm1_arrival',
  'm1_signal',
  'm1_signal_witness',
  'm1_role',
  'm1_capability',
  'm1_function_witness',
  'm1_edit',
  'm1_quiet_part',
  'm1_cost_witness',
  'm1_belonging',
  'm1_mirror',
  'm1_integration',
  'm1_dd_witness',
  'm1_bedrock',
  'm1_recognition_lens',
  'm1_closing',
  'm1_to_m2',
] as const;

// The fourteen keys below are the exact Screen Key values given in
// docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md.
// They are appended directly after m1_to_m2, the existing Movement One
// completion/transition screen. The screen-key structure itself was not
// changed by the 2026-09-09 Founder-locked package, only the copy carried
// on each screen (and m2_bedrock's rendering, which gained a local
// witness phase — see RememberExperience.tsx).
export const MOVEMENT_TWO_SCREEN_KEYS = [
  'm2_wm1',
  'm2_wm2',
  'm2_witness_1',
  'm2_wm3',
  'm2_wm4',
  'm2_witness_2',
  'm2_wm5',
  'm2_wm6',
  'm2_witness_3',
  'm2_mirror',
  'm2_bedrock',
  'm2_lens',
  'm2_closing',
  'm2_to_m3',
] as const;

export const ALLOWED_SCREEN_KEYS = [
  ...ENTRY_THRESHOLD_SCREENS.map((s) => s.key),
  ...MOVEMENT_ONE_SCREEN_KEYS,
  ...MOVEMENT_TWO_SCREEN_KEYS,
] as const;

export type RememberScreenKey = (typeof ALLOWED_SCREEN_KEYS)[number];

function isAllowedScreenKey(value: unknown): value is RememberScreenKey {
  return (
    typeof value === 'string' &&
    (ALLOWED_SCREEN_KEYS as readonly string[]).includes(value)
  );
}

// Completion-critical checkpoints. Section 10 of the governing document
// requires each of these to have actually been viewed, independent of
// current_screen_key (a single-value pointer that only reflects the most
// recent screen, not the full set of screens a participant has passed).
export const REQUIRED_VIEWED_CHECKPOINTS: readonly RememberScreenKey[] = [
  'm1_mirror',
  'm1_bedrock',
  'm1_recognition_lens',
] as const;

// The screen that marks a participant leaving the closing recognition and
// choosing Continue; reaching it is the final completion trigger under
// section 10 ("the participant reaches the closing and chooses Continue").
const MOVEMENT_ONE_COMPLETION_SCREEN: RememberScreenKey = 'm1_to_m2';

// Completion-critical checkpoints for Movement Two, per
// docs/design-specifications/pathway-two-remember-movement-two-v1.0-founder-locked-2026-09-09.md.
// Unlike Movement One, Movement Two's Bedrock is a saved response (see
// MOVEMENT_TWO_PROMPTS), not a viewed-only checkpoint, so it is not listed
// here. The no-forced-answer Founder ruling of 2026-09-05 (unaffected by
// this package) already means completion never requires any response,
// including bedrock_response, to be non-blank.
export const MOVEMENT_TWO_REQUIRED_VIEWED_CHECKPOINTS: readonly RememberScreenKey[] =
  ['m2_mirror', 'm2_lens'] as const;

// The screen that marks a participant leaving Movement Two's closing
// recognition and choosing Continue; reaching it is the Movement Two
// completion trigger, mirroring MOVEMENT_ONE_COMPLETION_SCREEN.
const MOVEMENT_TWO_COMPLETION_SCREEN: RememberScreenKey = 'm2_to_m3';

// Canonical Movement One v2.1 sequence order, derived directly from
// ALLOWED_SCREEN_KEYS (Entry Threshold, then the seventeen m1_* keys in
// Founder-locked order). Used to enforce that a session can only advance to
// the screen immediately following its own current_screen_key, and that a
// viewedScreenKey claim can only refer to the screen the session was
// actually on. This is the server-authoritative sequence guard; no
// screenKey/viewedScreenKey combination is accepted on trust.
const SCREEN_SEQUENCE_INDEX: Record<string, number> = ALLOWED_SCREEN_KEYS.reduce(
  (acc, key, index) => {
    acc[key] = index;
    return acc;
  },
  {} as Record<string, number>
);

function getNextAllowedScreenKey(currentKey: string): RememberScreenKey | null {
  const currentIndex = SCREEN_SEQUENCE_INDEX[currentKey];
  if (currentIndex === undefined) return null;
  const nextKey = ALLOWED_SCREEN_KEYS[currentIndex + 1];
  return nextKey ?? null;
}

// Determines which movement a given screen key belongs to, from its prefix.
// Used to detect and persist a movement transition as the participant
// advances screens. Version 1 only has one transition (Movement One into
// Movement Two); entry_* and m1_* screens belong to Movement One, since
// Movement One begins at session creation and has no earlier movement to
// transition from.
function getMovementKeyForScreen(screenKey: RememberScreenKey): string {
  if (screenKey.startsWith('m2_')) return MOVEMENT_TWO_KEY;
  return MOVEMENT_ONE_KEY;
}

// ---------------------------------------------------------------------------
// Sticky randomization (server-assigned, server-persisted)
// ---------------------------------------------------------------------------
// Governing document, section 6 (Randomization Architecture). Curated pools
// with multiple Founder-approved wordings exist today only for role cues
// (twelve items, listed in full). The arrival, witness, and Recognition
// Lens slots have exactly one approved wording each in section 4; 'default'
// is recorded now against each slot so additional curated wordings can be
// added later purely additively, without a schema or session-shape change,
// and without inventing unapproved participant-facing copy now.

const ROLE_CUE_POOL = [
  'the one who smooths it over',
  'the one who becomes useful',
  'the one who explains everyone',
  'the one who absorbs the tension',
  'the one who stays composed',
  'the one who fixes what is uncomfortable',
  'the one who says it is fine',
  'the one who carries what was left undone',
  'the one who makes herself easier to be around',
  'the one who waits to see what everyone else needs first',
  'the one who keeps things moving',
  'the one who disappears into responsibility',
] as const;

const ROLE_CUE_SUBSET_SIZE = 3;

export type RememberVariantAssignments = {
  arrival: 'default';
  witness: 'default';
  recognition_lens: 'default';
  role_cues: string[];
};

function assignVariants(): RememberVariantAssignments {
  const shuffled = [...ROLE_CUE_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    arrival: 'default',
    witness: 'default',
    recognition_lens: 'default',
    role_cues: shuffled.slice(0, ROLE_CUE_SUBSET_SIZE),
  };
}

// ---------------------------------------------------------------------------
// Row types (no generated Supabase types exist in this repository yet)
// ---------------------------------------------------------------------------

export type RememberSessionRow = {
  id: string;
  user_id: string;
  email: string;
  pathway_one_session_id: string;
  status: 'active' | 'completed';
  current_movement_key: string;
  current_screen_key: string;
  content_version: string | null;
  variant_assignments: RememberVariantAssignments | Record<string, never>;
  viewed_checkpoints: string[];
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RememberResponseRow = {
  id: string;
  remember_session_id: string;
  movement_key: string;
  prompt_key: string;
  prompt_order: number;
  response_text: string;
  created_at: string;
  updated_at: string;
};

// Explicit, queryable completion evidence for a single movement, distinct
// from pathway-level completion on remember_sessions. Approved by Founder
// ruling.
export type RememberMovementProgressRow = {
  id: string;
  remember_session_id: string;
  movement_key: string;
  status: 'active' | 'completed';
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------
// Steps 1-3 mirror the exact query pattern already used in
// app/record/page.tsx, character-for-character:
//   1. auth.getUser() server-side (never trust client-supplied identity)
//   2. most recent `returns` row for the verified email with q1_completed set
//   3. if none, check for an in-progress `returns` row (q1_completed is null)
// Step 4 mirrors app/record/page.tsx's decision logic (the declaration must
// be sealed) but selects only `status`, not app/record/page.tsx's full
// `status, sealed_at, session_id, email` — this eligibility check only needs
// the status branch below.
//   4. the `declarations` row for that returns.session_id must be sealed

export type RememberEligibility =
  | {
      eligible: true;
      userId: string;
      email: string;
      pathwayOneSessionId: string;
    }
  | { eligible: false; reason: 'unauthenticated' }
  | { eligible: false; reason: 'pathway_one_not_started' }
  | {
      eligible: false;
      reason: 'pathway_one_in_progress';
      pathwayOneSessionId: string;
    }
  | {
      eligible: false;
      reason: 'declaration_not_sealed';
      pathwayOneSessionId: string;
    };

export async function checkRememberEligibility(): Promise<RememberEligibility> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { eligible: false, reason: 'unauthenticated' };
  }

  const email = user.email.toLowerCase();
  const service = getServiceClient();

  const { data: returnRow, error: returnError } = await service
    .from('returns')
    .select('session_id, q1_completed, created_at')
    .eq('email', email)
    .not('q1_completed', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (returnError) {
    console.error('ReMEMBER eligibility — returns lookup failed:', returnError);
    throw new Error('Unable to verify Pathway One completion.');
  }

  if (!returnRow?.session_id) {
    const { data: activeRow, error: activeError } = await service
      .from('returns')
      .select('session_id')
      .eq('email', email)
      .is('q1_completed', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeError) {
      console.error(
        'ReMEMBER eligibility — active session lookup failed:',
        activeError
      );
      throw new Error('Unable to verify Pathway One progress.');
    }

    if (activeRow?.session_id) {
      return {
        eligible: false,
        reason: 'pathway_one_in_progress',
        pathwayOneSessionId: activeRow.session_id,
      };
    }

    return { eligible: false, reason: 'pathway_one_not_started' };
  }

  const { data: declaration, error: declarationError } = await service
    .from('declarations')
    .select('status')
    .eq('session_id', returnRow.session_id)
    .maybeSingle();

  if (declarationError) {
    console.error(
      'ReMEMBER eligibility — declaration lookup failed:',
      declarationError
    );
    throw new Error('Unable to verify Declaration status.');
  }

  if (!declaration || declaration.status !== 'sealed') {
    return {
      eligible: false,
      reason: 'declaration_not_sealed',
      pathwayOneSessionId: returnRow.session_id,
    };
  }

  return {
    eligible: true,
    userId: user.id,
    email,
    pathwayOneSessionId: returnRow.session_id,
  };
}

// Redirect targets for the server component page.
export function getRedirectForIneligibility(
  eligibility: Extract<RememberEligibility, { eligible: false }>
): string {
  switch (eligibility.reason) {
    case 'unauthenticated':
      // Matches app/record/page.tsx's own inline redirect target exactly.
      return '/begin';
    case 'pathway_one_not_started':
      // Founder ruling: a participant with no `returns` row has not begun
      // Pathway One™ and must land on the entry threshold, not on /return.
      // /return is a five-question reflection on a Return-to-Self journey
      // already completed, not an entry point. This deliberately diverges
      // from app/record/page.tsx, which still redirects this same case to
      // /return, a separate, currently live defect outside this slice's
      // approved scope.
      return '/begin';
    case 'pathway_one_in_progress':
      return `/pathway/return-to-self?session_id=${encodeURIComponent(
        eligibility.pathwayOneSessionId
      )}`;
    case 'declaration_not_sealed':
      return `/declaration?session_id=${encodeURIComponent(
        eligibility.pathwayOneSessionId
      )}`;
  }
}

// ---------------------------------------------------------------------------
// Ownership gate (server-only, service-role)
// ---------------------------------------------------------------------------
// Every read or write below is authorized against the authenticated user's
// own id, never against a client-supplied remember_session_id alone. A
// mismatch returns null rather than throwing: a foreign or unknown session
// id is a normal "not yours" condition, not a server error.
async function getOwnedSession(params: {
  userId: string;
  rememberSessionId: string;
}): Promise<RememberSessionRow | null> {
  const service = getServiceClient();

  const { data, error } = await service
    .from('remember_sessions')
    .select('*')
    .eq('id', params.rememberSessionId)
    .eq('user_id', params.userId)
    .maybeSingle();

  if (error) {
    console.error('ReMEMBER session ownership check failed:', error);
    throw new Error('Unable to verify ReMEMBER session ownership.');
  }

  return (data as RememberSessionRow) ?? null;
}

// ---------------------------------------------------------------------------
// Session helpers (server-only, service-role)
// ---------------------------------------------------------------------------

// pathwayOneSessionId must come from checkRememberEligibility()'s verified
// result, never from client-supplied input directly.
export async function getOrCreateActiveSession(params: {
  userId: string;
  email: string;
  pathwayOneSessionId: string;
}): Promise<RememberSessionRow> {
  const service = getServiceClient();

  const { data: existing, error: existingError } = await service
    .from('remember_sessions')
    .select('*')
    .eq('user_id', params.userId)
    .eq('status', 'active')
    .maybeSingle();

  if (existingError) {
    console.error('ReMEMBER session lookup failed:', existingError);
    throw new Error('Unable to load ReMEMBER session.');
  }

  let session: RememberSessionRow;

  if (existing) {
    // Existing sessions keep whatever content_version and
    // variant_assignments they already have, including null/empty for
    // sessions created before the Movement One v2.1 continuity migration.
    // Founder ruling: existing unversioned prototype sessions are never
    // silently relabeled.
    session = existing as RememberSessionRow;
  } else {
    const { data: created, error: insertError } = await service
      .from('remember_sessions')
      .insert({
        user_id: params.userId,
        email: params.email,
        pathway_one_session_id: params.pathwayOneSessionId,
        status: 'active',
        current_movement_key: MOVEMENT_ONE_KEY,
        current_screen_key: 'entry_01',
        content_version: MOVEMENT_ONE_CONTENT_VERSION,
        variant_assignments: assignVariants(),
      })
      .select('*')
      .single();

    if (insertError) {
      // remember_sessions_one_active_per_user is a partial unique index on
      // (user_id) where status = 'active'. Postgres unique_violation = 23505.
      // Under concurrent requests, another request may have created the
      // active session between our lookup and our insert; re-query rather
      // than fail.
      if (insertError.code === '23505') {
        const { data: raceRow, error: raceError } = await service
          .from('remember_sessions')
          .select('*')
          .eq('user_id', params.userId)
          .eq('status', 'active')
          .maybeSingle();

        if (raceError || !raceRow) {
          console.error(
            'ReMEMBER session race resolution failed:',
            raceError
          );
          throw new Error('Unable to resolve ReMEMBER session after conflict.');
        }

        session = raceRow as RememberSessionRow;
      } else {
        console.error('ReMEMBER session creation failed:', insertError);
        throw new Error('Unable to create ReMEMBER session.');
      }
    } else {
      session = created as RememberSessionRow;
    }
  }

  // A movement's progress row must exist from the moment the movement
  // begins. Movement One begins here because Version 1 has no earlier
  // movement to transition from.
  const progress = await getOrCreateMovementProgress({
    userId: params.userId,
    rememberSessionId: session.id,
    movementKey: session.current_movement_key,
  });

  if (!progress.ok) {
    console.error(
      'ReMEMBER session creation succeeded but movement progress did not:',
      progress.error
    );
    throw new Error('Unable to initialize ReMEMBER movement progress.');
  }

  return session;
}

export async function getActiveSessionForUser(
  userId: string
): Promise<RememberSessionRow | null> {
  const service = getServiceClient();

  const { data, error } = await service
    .from('remember_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('ReMEMBER active session lookup failed:', error);
    throw new Error('Unable to load ReMEMBER session.');
  }

  return (data as RememberSessionRow) ?? null;
}

// ---------------------------------------------------------------------------
// Movement progress (server-only, service-role)
// ---------------------------------------------------------------------------
// A remember_movement_progress row is created with status = 'active' and
// started_at set when a movement begins, and updated to status = 'completed'
// with completed_at set when that movement completes. This is deliberately
// separate from remember_sessions.status / completed_at, which remain
// reserved for completion of the entire Pathway Two™: ReMEMBER™ pathway.
export async function getOrCreateMovementProgress(params: {
  userId: string;
  rememberSessionId: string;
  movementKey: string;
}): Promise<
  | { ok: true; progress: RememberMovementProgressRow }
  | { ok: false; error: string }
> {
  const owned = await getOwnedSession(params);
  if (!owned) {
    return { ok: false, error: 'ReMEMBER session not found for this participant' };
  }

  const service = getServiceClient();

  const { data: existing, error: existingError } = await service
    .from('remember_movement_progress')
    .select('*')
    .eq('remember_session_id', params.rememberSessionId)
    .eq('movement_key', params.movementKey)
    .maybeSingle();

  if (existingError) {
    console.error('ReMEMBER movement progress lookup failed:', existingError);
    return { ok: false, error: 'Unable to load Movement progress.' };
  }

  if (existing) {
    return { ok: true, progress: existing as RememberMovementProgressRow };
  }

  const { data: created, error: insertError } = await service
    .from('remember_movement_progress')
    .insert({
      remember_session_id: params.rememberSessionId,
      movement_key: params.movementKey,
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (insertError) {
    // remember_movement_progress_unique_movement is a unique constraint on
    // (remember_session_id, movement_key). Postgres unique_violation = 23505.
    if (insertError.code === '23505') {
      const { data: raceRow, error: raceError } = await service
        .from('remember_movement_progress')
        .select('*')
        .eq('remember_session_id', params.rememberSessionId)
        .eq('movement_key', params.movementKey)
        .maybeSingle();

      if (raceError || !raceRow) {
        console.error(
          'ReMEMBER movement progress race resolution failed:',
          raceError
        );
        return {
          ok: false,
          error: 'Unable to resolve Movement progress after conflict.',
        };
      }

      return { ok: true, progress: raceRow as RememberMovementProgressRow };
    }

    console.error('ReMEMBER movement progress creation failed:', insertError);
    return { ok: false, error: 'Unable to create Movement progress.' };
  }

  return { ok: true, progress: created as RememberMovementProgressRow };
}

export async function getSessionResponses(params: {
  userId: string;
  rememberSessionId: string;
}): Promise<
  | { ok: true; responses: RememberResponseRow[] }
  | { ok: false; error: string }
> {
  const owned = await getOwnedSession(params);
  if (!owned) {
    return { ok: false, error: 'ReMEMBER session not found for this participant' };
  }

  const service = getServiceClient();

  const { data, error } = await service
    .from('remember_responses')
    .select(
      'id, remember_session_id, movement_key, prompt_key, prompt_order, response_text, created_at, updated_at'
    )
    .eq('remember_session_id', params.rememberSessionId)
    .order('movement_key', { ascending: true })
    .order('prompt_order', { ascending: true });

  if (error) {
    console.error('ReMEMBER response lookup failed:', error);
    return { ok: false, error: 'Unable to load ReMEMBER responses.' };
  }

  return { ok: true, responses: (data as RememberResponseRow[]) ?? [] };
}

// Saves exactly one response for the session's own current movement.
// movement_key is never client-supplied; it is always read from the owned
// session's current_movement_key, so a session can only write into the
// movement it has actually reached. prompt_order is always derived from
// that movement's own order map; the client never supplies it. response_text
// is preserved exactly as submitted. It is never trimmed, rewritten,
// paraphrased, summarized, sentiment-scored, or otherwise transformed, on
// autosave or on Continue.
export async function saveMovementResponse(params: {
  userId: string;
  rememberSessionId: string;
  promptKey: unknown;
  responseText: unknown;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const owned = await getOwnedSession(params);
  if (!owned) {
    return { ok: false, error: 'ReMEMBER session not found for this participant' };
  }

  const movementKey = owned.current_movement_key;

  let promptOrder: number | undefined;
  if (movementKey === MOVEMENT_ONE_KEY && isMovementOnePromptKey(params.promptKey)) {
    promptOrder = PROMPT_ORDER[params.promptKey];
  } else if (
    movementKey === MOVEMENT_TWO_KEY &&
    isMovementTwoPromptKey(params.promptKey)
  ) {
    promptOrder = MOVEMENT_TWO_PROMPT_ORDER[params.promptKey];
  }

  if (promptOrder === undefined) {
    return { ok: false, error: 'Unknown prompt_key for the current movement' };
  }

  if (typeof params.responseText !== 'string') {
    return { ok: false, error: 'response_text must be a string' };
  }

  const service = getServiceClient();

  const { error } = await service.from('remember_responses').upsert(
    {
      remember_session_id: params.rememberSessionId,
      movement_key: movementKey,
      prompt_key: params.promptKey as string,
      prompt_order: promptOrder,
      response_text: params.responseText,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'remember_session_id,movement_key,prompt_key' }
  );

  if (error) {
    console.error('ReMEMBER response upsert failed:', error);
    return { ok: false, error: 'Unable to save response' };
  }

  return { ok: true };
}

// Updates the internal resume checkpoint and, optionally, records that a
// screen the participant just left has been durably viewed. Never
// participant-facing progress tracking (no percentage, no count, no score).
//
// viewedScreenKey identifies the screen the participant is leaving, not the
// one they are entering; the caller supplies both on every forward
// navigation. Reaching the Movement One completion screen (m1_to_m2)
// triggers a completion check.
export async function advanceRememberScreen(params: {
  userId: string;
  rememberSessionId: string;
  screenKey: unknown;
  viewedScreenKey?: unknown;
}): Promise<
  | { ok: true; complete?: boolean }
  | { ok: false; error: string }
> {
  const owned = await getOwnedSession(params);
  if (!owned) {
    return { ok: false, error: 'ReMEMBER session not found for this participant' };
  }

  if (!isAllowedScreenKey(params.screenKey)) {
    return { ok: false, error: 'Unknown current_screen_key' };
  }

  // screenKey must be exactly the next screen after this session's actual
  // current_screen_key in the Founder-locked sequence. A client cannot skip
  // ahead of, or jump backward past, required screens, including the
  // Recognition Mirror, Bedrock, and Recognition Lens checkpoints that gate
  // completion. This also means m1_to_m2 (the completion trigger) is only
  // reachable when the session's current screen is genuinely m1_closing.
  const nextAllowed = getNextAllowedScreenKey(owned.current_screen_key);
  if (!nextAllowed || params.screenKey !== nextAllowed) {
    return { ok: false, error: 'screenKey is not the valid next screen for this session' };
  }

  let viewedKey: RememberScreenKey | undefined;
  if (params.viewedScreenKey !== undefined) {
    if (!isAllowedScreenKey(params.viewedScreenKey)) {
      return { ok: false, error: 'Unknown viewed screen key' };
    }
    // The viewed checkpoint must represent the screen the owned session was
    // actually on immediately before advancing, not any allowed screen key
    // the client chooses to claim.
    if (params.viewedScreenKey !== owned.current_screen_key) {
      return {
        ok: false,
        error: "viewedScreenKey does not match the session's current screen",
      };
    }
    viewedKey = params.viewedScreenKey;
  }

  const service = getServiceClient();
  const nowIso = new Date().toISOString();

  const existingViewed = owned.viewed_checkpoints ?? [];
  const nextViewed =
    viewedKey && !existingViewed.includes(viewedKey)
      ? [...existingViewed, viewedKey]
      : undefined;

  // Version 1 has exactly one movement transition (Movement One into
  // Movement Two). A session's current_movement_key is only ever updated
  // here, the moment the participant's screen advance actually crosses into
  // the next movement's screens.
  const nextMovementKey = getMovementKeyForScreen(params.screenKey);
  const movementChanged = nextMovementKey !== owned.current_movement_key;

  const updates: Partial<RememberSessionRow> = {
    current_screen_key: params.screenKey,
    updated_at: nowIso,
    ...(nextViewed ? { viewed_checkpoints: nextViewed } : {}),
    ...(movementChanged ? { current_movement_key: nextMovementKey } : {}),
  };

  const { error } = await service
    .from('remember_sessions')
    .update(updates)
    .eq('id', params.rememberSessionId);

  if (error) {
    console.error('ReMEMBER screen advance failed:', error);
    return { ok: false, error: 'Unable to update session state' };
  }

  if (movementChanged) {
    const progress = await getOrCreateMovementProgress({
      userId: params.userId,
      rememberSessionId: params.rememberSessionId,
      movementKey: nextMovementKey,
    });

    if (!progress.ok) {
      console.error(
        'ReMEMBER movement transition progress init failed:',
        progress.error
      );
      return { ok: false, error: 'Unable to initialize the next Movement' };
    }
  }

  if (params.screenKey === MOVEMENT_ONE_COMPLETION_SCREEN) {
    const completion = await tryCompleteMovementOne(params);
    if (!completion.ok) {
      console.error(
        'ReMEMBER Movement One completion check failed:',
        completion.error
      );
      return { ok: true };
    }
    return { ok: true, complete: completion.complete };
  }

  if (params.screenKey === MOVEMENT_TWO_COMPLETION_SCREEN) {
    const completion = await tryCompleteMovementTwo(params);
    if (!completion.ok) {
      console.error(
        'ReMEMBER Movement Two completion check failed:',
        completion.error
      );
      return { ok: true };
    }
    return { ok: true, complete: completion.complete };
  }

  return { ok: true };
}

// Shared completion check, parameterized by movement. A movement is
// internally complete only when:
//   - every screen in requiredViewedCheckpoints has been durably recorded in
//     remember_sessions.viewed_checkpoints (not merely inferred from screen
//     order);
//   - the caller has just advanced past that movement's closing screen
//     (enforced by the caller, advanceRememberScreen, which only invokes
//     this function when screenKey is that movement's post-closing
//     transition screen, itself only reachable by having advanced through
//     every earlier screen in the Founder-locked sequence one exact step at
//     a time — see getNextAllowedScreenKey).
//
// Per Founder ruling (no-forced-answer, 2026-09-05, recorded in
// docs/design-specifications/pathway-two-remember-copy-correction-2026-09-05.md),
// a participant must never be required to produce non-blank response text
// merely to progress or to be treated as having completed a movement.
// Completion is proven by durable screen/view progression alone: reaching
// the movement's completion-trigger screen, and having viewed the
// movement's required checkpoints. This function does not query
// remember_responses and does not treat a blank or absent response as
// evidence of anything, in either direction.
//
// Completion writes only to remember_movement_progress for the given
// movement_key. It does NOT set remember_sessions.status or completed_at;
// those remain reserved for completion of the entire Pathway Two™:
// ReMEMBER™ pathway. It does not create the Second Inheritance™ or a
// Recognition Record™.
async function tryCompleteMovement(params: {
  userId: string;
  rememberSessionId: string;
  movementKey: string;
  requiredViewedCheckpoints: readonly RememberScreenKey[];
}): Promise<
  | { ok: true; complete: true }
  | { ok: true; complete: false }
  | { ok: false; error: string }
> {
  const owned = await getOwnedSession(params);
  if (!owned) {
    return { ok: false, error: 'ReMEMBER session not found for this participant' };
  }

  const viewed = owned.viewed_checkpoints ?? [];
  const complete = params.requiredViewedCheckpoints.every((key) =>
    viewed.includes(key)
  );

  if (!complete) {
    return { ok: true, complete: false };
  }

  const service = getServiceClient();
  const nowIso = new Date().toISOString();

  const { error: progressError } = await service
    .from('remember_movement_progress')
    .update({
      status: 'completed',
      completed_at: nowIso,
      updated_at: nowIso,
    })
    .eq('remember_session_id', params.rememberSessionId)
    .eq('movement_key', params.movementKey);

  if (progressError) {
    console.error('ReMEMBER Movement progress update failed:', progressError);
    return { ok: false, error: 'Unable to record Movement completion' };
  }

  return { ok: true, complete: true };
}

export async function tryCompleteMovementOne(params: {
  userId: string;
  rememberSessionId: string;
}): Promise<
  | { ok: true; complete: true }
  | { ok: true; complete: false }
  | { ok: false; error: string }
> {
  return tryCompleteMovement({
    ...params,
    movementKey: MOVEMENT_ONE_KEY,
    requiredViewedCheckpoints: REQUIRED_VIEWED_CHECKPOINTS,
  });
}

export async function tryCompleteMovementTwo(params: {
  userId: string;
  rememberSessionId: string;
}): Promise<
  | { ok: true; complete: true }
  | { ok: true; complete: false }
  | { ok: false; error: string }
> {
  return tryCompleteMovement({
    ...params,
    movementKey: MOVEMENT_TWO_KEY,
    requiredViewedCheckpoints: MOVEMENT_TWO_REQUIRED_VIEWED_CHECKPOINTS,
  });
}
