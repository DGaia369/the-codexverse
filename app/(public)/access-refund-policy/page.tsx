import { Heading, Body, Section, GOLD_SOFT } from '@/components/public/PublicProse';

// Access & Refund Policy — V1 copy, Founder-approved 2026-09-28 (Launch
// Sprint 2 batch lock; docs/history/open-items.md item 22, prerequisite 8).
// Reproduced exactly as approved; not rewritten. It describes behavior that
// is already built: a full refund or a definitively lost dispute revokes
// only the purchase-derived entitlement, a partial refund does not, and
// nothing participant-created is deleted (docs/architecture/commerce.md).
// The earlier note that refund/access rules would be professionally
// reviewed before launch at scale still stands.

const SUPPORT_EMAIL = 'hello@thecodexverse.com';

const emailLinkStyle: React.CSSProperties = {
  color: GOLD_SOFT,
  textUnderlineOffset: '4px',
};

function SupportEmail() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} style={emailLinkStyle}>
      {SUPPORT_EMAIL}
    </a>
  );
}

export default function AccessRefundPolicyPage() {
  return (
    <main>
      <Section first>
        <Heading level={1}>Access & Refund Policy</Heading>
        <Body>
          Founding Access to Pathway Two™: ReMEMBER™ is a single payment of US$97. It is not a
          subscription, and nothing renews.
        </Body>
      </Section>

      <Section>
        <Heading>What your payment opens</Heading>
        <Body>
          Your payment opens Pathway Two™: ReMEMBER™ for the account you were signed in with when
          you paid. ReMEMBER™ follows Pathway One™, so it opens once your Declaration™ is sealed.
        </Body>
      </Section>

      <Section>
        <Heading>Refunds</Heading>
        <Body>
          You can ask for a full refund within 14 days of your purchase. You don’t need to give a
          reason. Write to <SupportEmail /> from the email address you sign in with and tell me you
          would like a refund.
        </Body>
        <Body>
          A full refund is returned to the way you paid. How long it takes to appear depends on
          your bank or card provider.
        </Body>
        <Body>
          When a full refund is made, the access to ReMEMBER™ that came from that payment closes. If
          I ever return only part of a payment, your access stays open.
        </Body>
      </Section>

      <Section>
        <Heading>What stays yours</Heading>
        <Body>
          A refund closes access. It does not automatically delete anything you created, including
          your responses and your recognition material.
        </Body>
      </Section>

      <Section>
        <Heading>Payment disputes</Heading>
        <Body>
          If a payment is disputed with a bank or card provider and the dispute is finally decided
          against the payment, the access to ReMEMBER™ that came from that payment closes, as it
          would after a refund.
        </Body>
        <Body>
          If something is wrong with a payment or with your access, please write to{' '}
          <SupportEmail /> first. I would rather put it right with you directly.
        </Body>
      </Section>

      <Section>
        <Heading>Your rights</Heading>
        <Body>
          Nothing in this policy limits any right you have under consumer law that cannot legally
          be waived.
        </Body>
      </Section>

      <Section>
        <Heading>Questions</Heading>
        <Body>
          <SupportEmail />
        </Body>
        <Body>Last updated: September 28, 2026.</Body>
      </Section>
    </main>
  );
}
