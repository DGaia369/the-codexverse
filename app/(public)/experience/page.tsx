import { Heading, Lead, Body, Section, CREAM } from '@/components/public/PublicProse';

// The Experience — Founder-supplied copy, relocated here from Home v0.1
// per the Phase 1 information-architecture correction. Reproduced exactly
// as supplied; not rewritten.
export default function ExperiencePage() {
  return (
    <main>
      <Section first>
        <Heading level={1}>What the codeXverse™ Is</Heading>
        <Lead>Recognition before transformation.</Lead>
        <Body>
          the codeXverse™ is a Recognition Ecosystem™. It creates conditions in which you can see what has become difficult to see while you were busy living, surviving, caring, achieving, adapting, and carrying what life placed in your hands.
        </Body>
        <Body>
          Transformation may follow recognition, but recognition comes first because once something true becomes visible, your relationship to it has already changed.
        </Body>
        <p style={{ fontSize: '17px', lineHeight: 1.9, color: CREAM, margin: 0, maxWidth: '600px' }}>
          Once you see it, you cannot unsee it.
        </p>
      </Section>

      <Section>
        <Heading>Technology</Heading>
        <Body>
          Technology has one role here: to support the conditions in which you can hear your own voice more clearly.
        </Body>
        <Body>
          Technology does not become the authority over what your experience means. It supports continuity, remembers where you left off, and helps return what you have already made visible to you.
        </Body>
      </Section>
    </main>
  );
}
