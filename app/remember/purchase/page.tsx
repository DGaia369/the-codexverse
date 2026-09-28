import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { authorizeRememberAccess } from '@/utils/authorization';
import { getRedirectForIneligibility } from '@/utils/remember';
import { isPurchasePathAvailable } from '@/utils/salesGate';
import CommerceFrame, { commerceButtonClass } from '../CommerceFrame';

// /remember/purchase: Founding Access purchase entry (Launch Sprint 2).
//
// Gate closed          -> /pathways#remember
// Unauthenticated      -> /enter?next=remember-checkout (fixed token)
// Ineligible           -> existing getRedirectForIneligibility() destination
// Already entitled     -> /remember (never offered a second purchase)
// Eligible, not entitled -> this page, whose only action posts to
//                          /api/remember/checkout
//
// Nothing here grants anything. The participant-facing lines on this page
// are Founder-approved V1 copy (2026-09-28; docs/architecture/commerce.md,
// "Commerce copy").

type PurchasePageProps = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function RememberPurchasePage({ searchParams }: PurchasePageProps) {
  // Always render per request. Without this, a closed gate at build time
  // redirects before any cookie is read, and Next prerenders the page as a
  // static redirect that would never run authorization.
  await connection();

  if (!isPurchasePathAvailable()) {
    redirect('/pathways#remember');
  }

  const authorization = await authorizeRememberAccess();

  if (!authorization.eligible) {
    redirect(
      authorization.reason === 'unauthenticated'
        ? '/enter?next=remember-checkout'
        : getRedirectForIneligibility(authorization)
    );
  }

  if (authorization.entitled) {
    redirect('/remember');
  }

  const status = (await searchParams)?.status;

  return (
    <CommerceFrame>
      <div className="space-y-5 text-lg leading-9 text-white/85">
        <p>Pathway Two™: ReMEMBER™</p>
        <p className="text-[#f3dfaa]">US$97 Founding Access, paid once.</p>
      </div>

      <form method="POST" action="/api/remember/checkout" className="mt-16">
        <button type="submit" className={commerceButtonClass}>
          continue to payment
        </button>
      </form>

      {status === 'unavailable' && (
        <p role="alert" className="mt-8 text-sm italic text-[#d7ba7d]/70">
          Payment couldn’t start, and nothing was charged. Try once more.
        </p>
      )}
    </CommerceFrame>
  );
}
