export type AgreementVariant = {
  key: string;
  eyebrow: string;
  lines: string[];
};

export function pickRandom<T extends { key: string }>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const noticingVariants: AgreementVariant[] = [
  {
    key: 'noticing_original',
    eyebrow: 'THE NOTICING',
    lines: [
      'Every choice you make answers to an agreement.',
      'Most of those agreements were never spoken out loud.',
      'The Noticing is the moment you see which agreement is asking for your yes.',
    ],
  },
  {
    key: 'noticing_body',
    eyebrow: 'THE NOTICING',
    lines: [
      'Some agreements do not begin as words.',
      'They begin as a tightening, a silence, a habit of making room for what costs you.',
      'The Noticing is the moment you stop calling it normal.',
    ],
  },
];

export const recognitionVariants: AgreementVariant[] = [
  {
    key: 'recognition_original',
    eyebrow: 'AGREEMENT IS AUTHORSHIP',
    lines: [
      'Agreement is authorship.',
      'Somewhere, you agreed to carry something that was never yours to carry.',
      'You did not see it as an agreement at the time. It felt like love, or duty, or survival.',
      'It was still an agreement. And agreements can be rewritten.',
    ],
  },
  {
    key: 'recognition_quiet_cost',
    eyebrow: 'AGREEMENT IS AUTHORSHIP',
    lines: [
      'Agreement is authorship.',
      'Every time you kept saying yes while something in you was saying no, a quiet agreement was being renewed.',
      'Not because you were weak.',
      'Because at the time, that agreement helped you survive something.',
      'Now you get to decide if it still gets to govern you.',
    ],
  },
];

export const completionVariants: AgreementVariant[] = [
  {
    key: 'completion_original',
    eyebrow: 'THE AGREEMENT™',
    lines: [
      'This agreement does not need to be perfect.',
      'It only needs to be yours.',
    ],
  },
  {
    key: 'completion_authorship',
    eyebrow: 'THE AGREEMENT™',
    lines: [
      'You did not just answer another question.',
      'You returned authorship to yourself.',
      'This does not need to be perfect.',
      'It only needs to be lived honestly.',
    ],
  },
];

export function findNoticingByKey(key?: string | null): AgreementVariant {
  return (
    noticingVariants.find((variant) => variant.key === key) ??
    noticingVariants[0]
  );
}

export function findRecognitionByKey(key?: string | null): AgreementVariant {
  return (
    recognitionVariants.find((variant) => variant.key === key) ??
    recognitionVariants[0]
  );
}

export function findCompletionByKey(key?: string | null): AgreementVariant {
  return (
    completionVariants.find((variant) => variant.key === key) ??
    completionVariants[0]
  );
}