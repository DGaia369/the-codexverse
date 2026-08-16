// Shared visual primitives for the public site only. Styling/structure
// only — no participant-facing copy lives in this file. Do not import into
// any immersive pathway route.

export const CREAM = 'var(--cxv-public-cream)';
export const GOLD = 'var(--cxv-public-gold)';
export const GOLD_SOFT = 'var(--cxv-public-gold-soft)';
export const BODY_COLOR = 'rgba(244,237,224,0.78)';

export const ctaStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  letterSpacing: '0.16em',
  color: GOLD_SOFT,
  textDecoration: 'none',
  border: '1px solid rgba(215,186,125,0.4)',
  borderRadius: '999px',
  padding: '14px 32px',
};

// Softened deliberately — a hard 1px border + solid card shape reads as a
// dashboard/software affordance. A faint tinted fill with no hard edge
// keeps the grouping legible without the enclosure feel.
export const pathwayCardStyle: React.CSSProperties = {
  border: '1px solid rgba(215,186,125,0.12)',
  borderRadius: '20px',
  padding: '40px',
  backgroundColor: 'rgba(215,186,125,0.03)',
};

export const pathwayLabelStyle: React.CSSProperties = {
  fontSize: '17px',
  letterSpacing: '0.02em',
  color: GOLD,
  margin: '0 0 16px',
};

export const statusPillStyle: React.CSSProperties = {
  border: '1px solid rgba(215,186,125,0.45)',
  borderRadius: '999px',
  padding: '4px 14px',
  fontSize: '12px',
  letterSpacing: '0.08em',
  color: GOLD_SOFT,
};

export function Heading({
  level = 2,
  children,
}: {
  level?: 1 | 2;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    fontSize: level === 1 ? 'clamp(1.9rem, 4vw, 2.75rem)' : 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 500,
    color: CREAM,
    margin: '0 0 28px',
    lineHeight: 1.3,
  };

  if (level === 1) {
    return <h1 style={style}>{children}</h1>;
  }

  return <h2 style={style}>{children}</h2>;
}

// A short, weighted thesis line (e.g. "Recognition before transformation.")
export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontStyle: 'italic',
        fontSize: '21px',
        fontWeight: 400,
        lineHeight: 1.7,
        color: GOLD_SOFT,
        margin: '0 0 32px',
        maxWidth: '640px',
      }}
    >
      {children}
    </p>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: '17px',
        fontWeight: 300,
        lineHeight: 1.9,
        color: BODY_COLOR,
        margin: '0 0 24px',
        maxWidth: '640px',
      }}
    >
      {children}
    </p>
  );
}

// Wraps one topical block. `first` removes the top divider — used for the
// first (or only) content block on a page. Where a divider is used at all
// (a second topic on the same page, e.g. /experience's Technology block),
// it is a short, centered hairline rather than a full-width rule, so
// two distinct topics get a hair of separation without the page reading
// as section → stop → section → stop.
export function Section({
  children,
  first = false,
  narrow = false,
}: {
  children: React.ReactNode;
  first?: boolean;
  narrow?: boolean;
}) {
  return (
    <section style={{ padding: first ? '104px 24px 96px' : '80px 24px 96px' }}>
      <div style={{ maxWidth: narrow ? '600px' : '720px', margin: '0 auto' }}>
        {!first && (
          <div
            aria-hidden="true"
            style={{
              width: '48px',
              height: '1px',
              backgroundColor: 'rgba(215,186,125,0.3)',
              margin: '0 0 64px',
            }}
          />
        )}
        {children}
      </div>
    </section>
  );
}

// Structural shell for pages whose copy has not yet been supplied
// (Our Promise, Lexicon, and the footer legal routes). Deliberately reuses
// the same "pending" marker pattern established in Phase 0 rather than
// inventing new placeholder language.
export function PendingPageShell({ title }: { title: string }) {
  return (
    <Section first>
      <Heading level={1}>{title}</Heading>
      <div
        style={{
          border: '1px dashed rgba(215,186,125,0.35)',
          borderRadius: '12px',
          padding: '28px 24px',
          maxWidth: '640px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(215,186,125,0.7)',
            margin: '0 0 12px',
          }}
        >
          Placeholder — pending Founder-approved copy
        </p>
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'rgba(244,237,224,0.55)',
            margin: 0,
          }}
        >
          This page exists structurally. Its participant-facing copy has not
          been written or approved yet.
        </p>
      </div>
    </Section>
  );
}
