import {
  Heading,
  Body,
  Section,
  BODY_COLOR,
  CREAM,
  pathwayCardStyle,
  pathwayLabelStyle,
  statusPillStyle,
  ctaStyle,
} from '@/components/public/PublicProse';
import RememberWaitlist from '@/components/public/RememberWaitlist';
import { isPublicPurchaseOpen } from '@/utils/salesGate';

// The Pathways — Founder-supplied copy, relocated here from Home v0.1 per
// the Phase 1 information-architecture correction. Reproduced exactly as
// supplied; not rewritten. Movement One through Six content is
// intentionally absent — this page is the public Pathways description
// only.
export default function PathwaysPage() {
  const purchaseOpen = isPublicPurchaseOpen();

  return (
    <main>
      <Section first>
        <Heading level={1}>the Pathways</Heading>
        <Body>There are places inside us we cannot reach by being told what to do.</Body>
        <Body>
          The Pathways are complete recognition passages. Each creates different conditions for seeing what has been present but difficult to recognize.
        </Body>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '48px' }}>
          <div style={pathwayCardStyle}>
            <p style={pathwayLabelStyle}>Pathway One™: Return to Self</p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: BODY_COLOR, margin: 0 }}>
              Available now. Your first crossing begins with recognition, not reinvention.
            </p>
          </div>

          {/* Stable anchor (Founder ruling 2026-09-24): /pathways#remember is
              the durable public destination for the Pathway Two™ offer state.
              scrollMarginTop keeps the card clear of the sticky header. */}
          <div id="remember" style={{ ...pathwayCardStyle, scrollMarginTop: '128px' }}>
            <p style={pathwayLabelStyle}>Pathway Two™: ReMEMBER™</p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: BODY_COLOR, margin: '0 0 24px' }}>
              The next passage gathers what became scattered while you were becoming who the world required.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '15px', color: CREAM }}>US$97 Founding Access</span>
              {!purchaseOpen && <span style={statusPillStyle}>Opening Soon</span>}
            </div>

            {/* Launch Sprint 2 sales gate (utils/salesGate.ts). Closed: the
                waitlist. Open (only after the Founder rules OPEN FOUNDING
                ACCESS): the purchase path. The card itself makes no
                authorization decision; /remember/purchase does. The open
                CTA label is PROVISIONAL, pending Founder approval. */}
            {purchaseOpen ? (
              <div style={{ marginTop: '28px' }}>
                <a href="/remember/purchase" style={ctaStyle}>
                  BEGIN FOUNDING ACCESS
                </a>
              </div>
            ) : (
              <RememberWaitlist />
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
