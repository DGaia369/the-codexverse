# Commerce Copy and V1 Refund Policy: Founder Review Package (Launch Sprint 2)

**Status:** Historical record. **Approved with changes in the Founder batch lock of 2026-09-28, and implemented.** The approved and implemented copy is recorded in `docs/architecture/commerce.md` ("Commerce copy") and `docs/history/open-items.md` item 22. Changes from this proposal:
- The support address is hello@thecodexverse.com (D1).
- The refund window is 14 days (D2).
- "Your access does not expire." is removed. No perpetual-access promise is made (D3).
- "What stays yours" says a refund does not *automatically* delete participant-created records (D4).
- The voice is first-person "I" (D5).
- The refund-arrival time ("5 to 10 business days") is removed.
- Item 13, `continue`, is approved as is.

The text below is the proposal as it was submitted. Originally: This package serves OPEN FOUNDING ACCESS prerequisites 8 (refund-policy copy) and 9 (commerce copy) in `docs/history/open-items.md` item 22. The approved waitlist copy is not reopened. Movement One™ is out of scope.
**Date:** September 28, 2026
**Authority:** Diana Francis (approval pending)
**Feature branch:** `feature/pathway-two-remember`

Drafting rules applied (`docs/standards/writing-standards.md`, `participant-language.md`, `canon/terminology.md`):
- no em dashes, and no ladder stacking
- plain, warm, precise
- the codeXverse™ naming conventions preserved
- the first-person Founder voice already established by the approved waitlist line "When this passage opens, I'll let you know."

## Commerce copy

| # | Current copy | Purpose | Where | Status | Proposed final copy |
|---|---|---|---|---|---|
| 1 | "US$97 Founding Access"; pill "Opening Soon" (closed state only) | Names the offer and price | Public card, `/pathways#remember` (`app/(public)/pathways/page.tsx:49–50`) | Built under the Sprint 2 directive; no separate approval recorded | **Keep** both as written. |
| 2 | `BEGIN FOUNDING ACCESS` | Open-state purchase CTA, replaces the waitlist | Public card, open state only (`pathways/page.tsx:61`) | PLACEHOLDER | **Keep** `BEGIN FOUNDING ACCESS`. It names what is bought and matches the price line. |
| 3 | "Pathway Two™: ReMEMBER™" | Purchase-page heading | `/remember/purchase` (`app/remember/purchase/page.tsx:54`) | PLACEHOLDER | **Keep.** |
| 4 | "US$97 Founding Access" | Price language | `/remember/purchase:55` | PLACEHOLDER | "US$97 Founding Access, paid once." This says it is not a subscription. |
| 5 | `continue to payment` | Purchase CTA | `/remember/purchase:60` | PLACEHOLDER | **Keep.** Lowercase matches the ritual buttons. |
| 6 | "Pathway Two™: ReMEMBER™ Founding Access" | Line item on Stripe Checkout and the receipt | `utils/offers.ts:29` (`checkoutName`) | PLACEHOLDER | **Keep.** Separately, the bank statement descriptor and Checkout branding are Stripe account settings (see the production package). |
| 7 | "Your payment is complete." | Payment confirmed, access pending | `/remember/confirm` (`ConfirmWaiting.tsx:55`) | PLACEHOLDER | **Keep.** |
| 8a | "ReMEMBER™ is being opened for you. This usually takes a few seconds." | While the webhook is pending | `ConfirmWaiting.tsx:58` | PLACEHOLDER | **Keep.** |
| 8b | "This is taking longer than usual. You can check again." + `check again` | After about 30 s with no access | `ConfirmWaiting.tsx:59, 72` | PLACEHOLDER | "This is taking a little longer than usual. Check again in a moment." Keep the `check again` button. |
| 9 | "We can't confirm this payment yet." / "If you've just paid, check again in a moment." / `check again` / `return to Pathway Two™: ReMEMBER™` | Unconfirmed or unknown session | `app/remember/confirm/page.tsx:70–79` | PLACEHOLDER | Keep the first two lines and both links. **Add:** "If you paid and this doesn't change, write to [support address] and I'll sort it out." *Needs a support address (decision D1).* |
| 10 | "Something did not go through. Try once more." | Checkout could not start. This happens before Stripe, so nothing was charged. | `/remember/purchase?status=unavailable` (`purchase/page.tsx:66`) | Reused `/enter` copy; not approved for commerce | "Payment couldn't start, and nothing was charged. Try once more." |
| 11 | none (empty `PendingPageShell`) | Access & Refund Policy | `/access-refund-policy` | OPEN | Full V1 text below. |
| 12 | Buttons and links: `continue to payment`, `check again`, `return to Pathway Two™: ReMEMBER™` | Commerce navigation | as above | PLACEHOLDER | **Keep** all three. |
| 13 | `continue` | Entry Threshold button, participant experience, **not commerce** | `app/remember/RememberExperience.tsx:637` | OPEN REVIEW (item 26) | Choose between: (a) approve `continue` as is, consistent with the lowercase ritual buttons; or (b) give the exact word. It is recorded separately from this commerce approval. |

Notes:
- Cancelling on Stripe's page returns silently to `/pathways#remember` (`cancel_url`). There is no cancel copy, and none is proposed.
- The text on Stripe's hosted Checkout page (business name, logo, colors) is set in the Stripe Dashboard, not in this repository.

## Proposed V1 Access & Refund Policy (`/access-refund-policy`)

Bracketed items are decisions for the Founder (listed after the text). Everything else describes behavior that is already built and ruled.

> **Access & Refund Policy**
>
> **Founding Access to Pathway Two™: ReMEMBER™**
>
> Founding Access is a single payment of US$97. It is not a subscription, and nothing renews.
>
> **What your payment opens**
>
> Your payment opens Pathway Two™: ReMEMBER™ for the account you were signed in with when you paid. ReMEMBER™ follows Pathway One™, so it opens once your Declaration™ is sealed. Your access does not expire.
>
> **Refunds**
>
> If ReMEMBER™ is not right for you, you can ask for a full refund within [14] days of your payment. Write to [support address] from the email address you sign in with and tell me you would like a refund. You don't need to give a reason. The full US$97 goes back to the card you paid with, and your bank may take 5 to 10 business days to show it.
>
> When a full refund is made, access to ReMEMBER™ closes for that account. If I ever return only part of a payment, your access stays open.
>
> **What stays yours**
>
> A refund closes access. It does not erase what you have written, and nothing you wrote is deleted because of a refund.
>
> **Payment disputes**
>
> If a payment is disputed with a bank and the dispute is decided against the payment, access to ReMEMBER™ closes for that account, as it would after a refund. If something is wrong, please write to me first. I would rather put it right with you directly.
>
> **Your rights**
>
> Nothing here limits any right you have under the consumer law where you live.
>
> **Questions**
>
> [support address]
>
> Last updated: [date of approval]

**Decisions this text needs:**
- **D1 Support address.** None exists in the repository. The Privacy and Terms pages are also empty shells.
- **D2 Refund window.** 14 days is proposed. Alternatives: 7 or 30 days, a refund before Movement One™ begins, or no refunds. The system supports any of these; refunds are made manually by you in Stripe.
- **D3 "Your access does not expire."** True of the build (`expires_at` is null). Confirm it as a promise.
- **D4 "What stays yours."** True of the build (refunds and disputes delete nothing). Confirm you want to state it.
- **D5 Voice.** First person "I", matching the approved waitlist line. Or "we".
- **D6 Legal review.** This is plain-language operational copy, not legal advice. Whether it needs legal review, together with Terms and Privacy, before paid traffic is your call.

## Related

- `docs/architecture/commerce.md` ("Copy awaiting Founder approval")
- `docs/history/open-items.md`, items 22 and 26
