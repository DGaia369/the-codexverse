import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Minimal local Database typing (no generated Supabase types exist in this
// repository yet)
// ---------------------------------------------------------------------------
// Mirrors the pattern established in utils/remember.ts: a narrow Database
// type covering only the tables/columns this file actually touches, passed
// to createClient<Database>(...). That file's TableOf/GenericRelationship
// helpers are not exported, so they are reproduced here rather than shared,
// consistent with the existing convention of each file owning its own
// service-role client and typing rather than a shared database-access
// architecture.
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

export type ProductRow = {
  id: string;
  key: string;
  name: string;
  status: 'active' | 'retired';
  created_at: string;
};

export type EntitlementRow = {
  id: string;
  user_id: string;
  product_id: string;
  source_type: 'verified_acquisition' | 'admin_grant';
  status: 'active' | 'revoked';
  starts_at: string;
  expires_at: string | null;
  granted_by_user_id: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      products: TableOf<ProductRow>;
      entitlements: TableOf<EntitlementRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// ---------------------------------------------------------------------------
// Service-role client (server-only)
// ---------------------------------------------------------------------------
// SERVER-SIDE ONLY. This module reads SUPABASE_SERVICE_ROLE_KEY, never a
// NEXT_PUBLIC_* variable, and must never be imported from client code — the
// same boundary already relied on in utils/remember.ts. The npm `server-only`
// package is not installed anywhere in this repository (no import of it
// exists), so it is not introduced here either; that decision was reported
// rather than adding new infrastructure unilaterally.

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
// Product resolution
// ---------------------------------------------------------------------------
// Founding Access and its US$97 price are offer/commerce concepts and are
// deliberately not encoded anywhere in this service — see
// docs/architecture/database.md, "Commerce + Access: products and
// entitlements".

export const PATHWAY_TWO_PRODUCT_KEY = 'pathway-two-remember' as const;

async function resolveProduct(productKey: string): Promise<ProductRow> {
  const service = getServiceClient();

  const { data, error } = await service
    .from('products')
    .select('id, key, name, status, created_at')
    .eq('key', productKey)
    .maybeSingle();

  if (error) {
    console.error('Entitlement service — product lookup failed:', error);
    throw new Error('Unable to resolve product.');
  }

  // An unknown product key is a configuration/data problem, not "the
  // participant lacks an entitlement" — it must surface distinctly rather
  // than be absorbed into a false result.
  if (!data) {
    throw new Error(`Unknown product key: "${productKey}"`);
  }

  return data as ProductRow;
}

// ---------------------------------------------------------------------------
// hasEffectiveEntitlement
// ---------------------------------------------------------------------------
// Effective-entitlement rule (owned here, not enforced by the schema):
//   status = 'active'
//   AND starts_at <= now()
//   AND (expires_at IS NULL OR expires_at > now())
//
// Existence-only: does not inspect source_type, product.status, Pathway
// eligibility, or recognition data, and does not assume a single row per
// participant/product. A revoked grant never removes access if another
// effective row exists, because this is a plain existence check across all
// matching rows, not a lookup of one particular row.
export async function hasEffectiveEntitlement(
  userId: string,
  productKey: string
): Promise<boolean> {
  const product = await resolveProduct(productKey);
  const service = getServiceClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await service
    .from('entitlements')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', product.id)
    .eq('status', 'active')
    .lte('starts_at', nowIso)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      'Entitlement service — effective entitlement lookup failed:',
      error
    );
    throw new Error('Unable to verify entitlement.');
  }

  return data !== null;
}

// ---------------------------------------------------------------------------
// grantAdminEntitlement
// ---------------------------------------------------------------------------
// Creates one source_type = 'admin_grant' entitlement row. The database
// intentionally does not enforce granted_by_user_id non-null for admin_grant
// rows (see docs/history/2026-09-14-commerce-access-entitlement-integrity-applied.md)
// so that a grantor's auth.users row can later be nulled on delete; real
// grantor enforcement belongs here instead.
export type GrantAdminEntitlementParams = {
  userId: string;
  productKey: string;
  grantedByUserId: string;
  startsAt?: Date | string;
  expiresAt?: Date | string | null;
};

export async function grantAdminEntitlement(
  params: GrantAdminEntitlementParams
): Promise<EntitlementRow> {
  const { userId, productKey, grantedByUserId } = params;

  if (!userId) {
    throw new Error('userId is required to grant an entitlement.');
  }
  if (!productKey) {
    throw new Error('productKey is required to grant an entitlement.');
  }
  if (!grantedByUserId) {
    throw new Error(
      'grantedByUserId is required to create an admin_grant entitlement.'
    );
  }

  const product = await resolveProduct(productKey);

  const startsAt = params.startsAt
    ? new Date(params.startsAt).toISOString()
    : new Date().toISOString();

  let expiresAt: string | null = null;
  if (params.expiresAt !== undefined && params.expiresAt !== null) {
    expiresAt = new Date(params.expiresAt).toISOString();
    if (new Date(expiresAt).getTime() <= new Date(startsAt).getTime()) {
      throw new Error('expiresAt must be strictly after startsAt.');
    }
  }

  const service = getServiceClient();

  const { data, error } = await service
    .from('entitlements')
    .insert({
      user_id: userId,
      product_id: product.id,
      source_type: 'admin_grant',
      status: 'active',
      starts_at: startsAt,
      expires_at: expiresAt,
      granted_by_user_id: grantedByUserId,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Entitlement service — admin grant creation failed:', error);
    throw new Error('Unable to create admin grant entitlement.');
  }

  return data as EntitlementRow;
}
