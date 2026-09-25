import {
  checkRememberEligibility,
  type RememberEligibility,
} from '@/utils/remember';
import {
  hasEffectiveEntitlement,
  PATHWAY_TWO_PRODUCT_KEY,
} from '@/utils/entitlements';

// ---------------------------------------------------------------------------
// authorizeRememberAccess
// ---------------------------------------------------------------------------
// Composes the answers of two independently owned services. This file owns
// no eligibility predicate and no entitlement predicate of its own:
//   - eligibility predicate: utils/remember.ts (checkRememberEligibility)
//   - entitlement predicate: utils/entitlements.ts (hasEffectiveEntitlement)
//
// No userId argument: checkRememberEligibility() already resolves the
// authenticated participant from the current request/session context and
// returns the trusted userId on success. Accepting a caller-supplied userId
// here would be redundant at best and could diverge from the authenticated
// participant at worst.
//
// Ineligible requests short-circuit before hasEffectiveEntitlement() is ever
// called: entitlement is irrelevant to a denial that eligibility alone
// already decided, and admin grants are not gated on eligibility (an
// entitlement can exist for a participant who hasn't completed Pathway One),
// so evaluating it in that branch would be a meaningless data point at best.
//
// 'not_entitled' means exactly what hasEffectiveEntitlement() means: no
// effective entitlement row exists for this product. It says nothing about
// how an entitlement would be earned or granted — Founding Access is one
// offer/acquisition path, not the definition of entitlement.
export type RememberAuthorization =
  | {
      authorized: true;
      eligible: true;
      entitled: true;
      userId: string;
      email: string;
      pathwayOneSessionId: string;
    }
  | {
      authorized: false;
      eligible: true;
      entitled: false;
      reason: 'not_entitled';
      userId: string;
      email: string;
      pathwayOneSessionId: string;
    }
  | (Extract<RememberEligibility, { eligible: false }> & {
      authorized: false;
    });

export async function authorizeRememberAccess(): Promise<RememberAuthorization> {
  const eligibility = await checkRememberEligibility();

  if (!eligibility.eligible) {
    return { ...eligibility, authorized: false };
  }

  const entitled = await hasEffectiveEntitlement(
    eligibility.userId,
    PATHWAY_TWO_PRODUCT_KEY
  );

  if (!entitled) {
    return {
      authorized: false,
      eligible: true,
      entitled: false,
      reason: 'not_entitled',
      userId: eligibility.userId,
      email: eligibility.email,
      pathwayOneSessionId: eligibility.pathwayOneSessionId,
    };
  }

  return {
    authorized: true,
    eligible: true,
    entitled: true,
    userId: eligibility.userId,
    email: eligibility.email,
    pathwayOneSessionId: eligibility.pathwayOneSessionId,
  };
}
