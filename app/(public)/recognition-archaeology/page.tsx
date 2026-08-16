import { Heading, Body, Section } from '@/components/public/PublicProse';

// Recognition Archaeology™ — Founder-supplied copy, relocated here from
// Home v0.1 per the Phase 1 information-architecture correction.
// Reproduced exactly as supplied; not rewritten. This is the public
// description of the discipline only — internal excavation methods
// (Interrogate/Excavate/DD/WEAPONIZE/Bedrock), Movement mechanics, signal
// selection logic, and Build Room architecture are deliberately absent.
export default function RecognitionArchaeologyPage() {
  return (
    <main>
      <Section first>
        <Heading level={1}>Recognition Archaeology™</Heading>
        <Body>Some truths are not missing. They are buried beneath what became normal.</Body>
        <Body>
          Recognition Archaeology™ is the practice of looking beneath what you have learned to live with long enough for what is yours to become visible again.
        </Body>
        <Body>We do not tell you who you are. We create conditions in which you can recognize her yourself.</Body>
      </Section>
    </main>
  );
}
