import Link from 'next/link';
import { Heading, Body, ctaStyle, GOLD, CREAM } from '@/components/public/PublicProse';

// Home — Public Website Phase 1B correction.
//
// Home is an arrival page: Hero, the First Recognition territory, and a
// single closing invitation into the immersive experience. What the
// codeXverse™ Is, Recognition Archaeology™, the Library of Yourself™, the
// Pathways, Technology, and the Founder live on their own routes (see
// app/(public)/experience, /pathways, /recognition-archaeology,
// /library-of-yourself, /about) — reachable via the public header, which
// is the sole room-navigation mechanism. Phase 1A had also repeated those
// six destinations as a doorway list in Home's body; Phase 1B removes
// that list as a duplicate of the header nav. No replacement
// cards/tiles/menu was added, and no transitional copy was written — the
// page now moves from Hero straight to the First Recognition to the
// closing doorway, using spacing alone for the transition.
//
// The closing CTA routes directly into /threshold (the immersive arrival
// atmosphere); Threshold's own CTA is the authentication gate into /enter.
// See components/public/PublicHeader.tsx for the matching header change.
// Public Website v1.0.1 arrival-choreography correction.

export default function PublicHomePage() {
  return (
    <main>
      {/* HERO */}
      <section style={{ padding: '128px 24px 96px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '13px',
              letterSpacing: '0.22em',
              color: GOLD,
              margin: '0 0 32px',
            }}
          >
            the codeXverse™
          </p>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 500,
              lineHeight: 1.3,
              color: CREAM,
              margin: '0 auto 40px',
              maxWidth: '680px',
            }}
          >
            What if the answer is not another version of you?
          </h1>

          <p style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.9, color: 'rgba(244,237,224,0.78)', margin: '0 auto 24px', maxWidth: '600px' }}>
            You may have spent years becoming who life required you to be. Somewhere beneath all that adapting, carrying, continuing, and becoming useful, there is still a self who did not disappear.
          </p>

          <p style={{ fontSize: '18px', fontWeight: 300, lineHeight: 1.9, color: 'rgba(244,237,224,0.78)', margin: '0 auto', maxWidth: '600px' }}>
            You do not have to invent her.
          </p>
        </div>
      </section>

      {/* THE FIRST RECOGNITION */}
      <section style={{ padding: '72px 24px 120px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Heading>the First Recognition</Heading>
          <Body>
            Life can become so full of what needs you that continuing starts to feel automatic. Somewhere inside all that keeping up, carrying on, and getting through, it can become difficult to hear the part of you that has been there the whole time.
          </Body>
          <Body>
            The question here is not simply what needs to change. It is what has become so familiar that you stopped seeing it.
          </Body>
        </div>
      </section>

      {/* FINAL DOORWAY — the page's only Enter the Threshold™ CTA */}
      <section style={{ padding: '96px 24px 160px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '20px', lineHeight: 1.8, color: CREAM, margin: '0 0 20px' }}>
            Something brought you here.
          </p>
          <p style={{ fontSize: '17px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(244,237,224,0.78)', margin: '0 0 20px' }}>
            You do not have to know what it means yet.
          </p>
          <p style={{ fontSize: '17px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(244,237,224,0.78)', margin: '0 0 48px' }}>
            If something in you recognized itself while you were here, you can follow that.
          </p>
          {/* Routes directly into /threshold. See header note above. */}
          <Link href="/threshold" style={ctaStyle}>
            Enter the Threshold™
          </Link>
        </div>
      </section>
    </main>
  );
}
