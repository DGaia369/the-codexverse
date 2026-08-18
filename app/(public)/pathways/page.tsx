import {
  Heading,
  Body,
  Section,
  BODY_COLOR,
  CREAM,
  pathwayCardStyle,
  pathwayLabelStyle,
  statusPillStyle,
} from '@/components/public/PublicProse';

// The Pathways — Founder-supplied copy, relocated here from Home v0.1 per
// the Phase 1 information-architecture correction. Reproduced exactly as
// supplied; not rewritten. Movement One through Six content is
// intentionally absent — this page is the public Pathways description
// only.
export default function PathwaysPage() {
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

          {/* Transition marker between passages — reuses the existing
              canonical sigil asset (public/Sigil.png, already used in the
              /begin arrival flow). Decorative only: no label, no copy. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '8px 0',
            }}
          >
            <img
              src="/Sigil.png"
              alt=""
              aria-hidden="true"
              style={{
                width: '56px',
                height: 'auto',
                opacity: 0.6,
                mixBlendMode: 'lighten',
              }}
            />
          </div>

          <div style={pathwayCardStyle}>
            <p style={pathwayLabelStyle}>Pathway Two™: ReMEMBER™</p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: BODY_COLOR, margin: '0 0 24px' }}>
              The next passage gathers what became scattered while you were becoming who the world required.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '15px', color: CREAM }}>US$97 Founding Access</span>
              <span style={statusPillStyle}>Opening Soon</span>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
