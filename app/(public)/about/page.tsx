import { Heading, Lead, Body, Section, CREAM, GOLD } from '@/components/public/PublicProse';

// The Founder — Founder-supplied copy, relocated here from Home v0.1 per
// the Phase 1 information-architecture correction. Reproduced exactly as
// supplied; not rewritten.
export default function AboutPage() {
  return (
    <main>
      <Section first>
        <Heading level={1}>the Founder</Heading>
        <Lead>I am the first participant.</Lead>
        <Body>
          I did not create the codeXverse™ from the safe distance of someone who had already figured herself out. I entered first.
        </Body>
        <Body>
          I know what it is to live so long inside responsibility, roles, survival, expectation, and other people&rsquo;s needs that the question What do I want? becomes unexpectedly difficult to answer.
        </Body>
        <Body>the codeXverse™ came into form from inside that recognition.</Body>

        <div style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '15px', color: CREAM, margin: '0 0 6px' }}>Diana Francis | D. Claire</p>
          <p style={{ fontSize: '13px', letterSpacing: '0.06em', color: GOLD, margin: 0 }}>
            Creator of the codeXverse™
          </p>
        </div>
      </Section>
    </main>
  );
}
