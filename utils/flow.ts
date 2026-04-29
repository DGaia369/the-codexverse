type ResponseInput = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  door: string;
  pathway: string;
};

type ResponseCategory =
  | "needs_clarity"
  | "needs_support"
  | "ready_for_next_step"
  | "self_abandonment"
  | "avoidance"
  | "overwhelm"
  | "identity_rebuild"
  | "truth_resistance"
  | "power_return"
  | "general";

type Door =
  | "rebuilding"
  | "stuck"
  | "inconsistent"
  | "lost"
  | "clarity"
  | "power"
  | "voice"
  | "rest";

type Pathway =
  | "self-directed"
  | "guided-support"
  | "return-to-self"
  | "rebuild-foundation"
  | "restore-rhythm"
  | "reclaim-voice"
  | "choose-again"
  | "next-step"
  | "identity-reset"
  | "pattern-break"
  | "sovereign-action";

function normalizeText(input: ResponseInput) {
  return [input.q1, input.q2, input.q3, input.q4, input.q5]
    .join(" ")
    .toLowerCase();
}

function containsAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function classifyResponse(input: ResponseInput): ResponseCategory {
  const combined = normalizeText(input);

  if (
    containsAny(combined, [
      "abandon",
      "self abandonment",
      "betray myself",
      "lost myself",
      "forgot myself",
      "not choosing me",
    ])
  ) {
    return "self_abandonment";
  }

  if (
    containsAny(combined, [
      "avoid",
      "avoiding",
      "procrastinate",
      "delay",
      "hiding",
      "distract",
      "scrolling",
    ])
  ) {
    return "avoidance";
  }

  if (
    containsAny(combined, [
      "overwhelmed",
      "too much",
      "burnt out",
      "exhausted",
      "tired",
      "heavy",
      "scared",
      "anxious",
    ])
  ) {
    return "overwhelm";
  }

  if (
    containsAny(combined, [
      "clarity",
      "clear",
      "aware",
      "awareness",
      "confused",
      "uncertain",
      "not sure",
    ])
  ) {
    return "needs_clarity";
  }

  if (
    containsAny(combined, [
      "support",
      "help",
      "alone",
      "lonely",
      "hesitant",
      "hold this",
      "guide me",
    ])
  ) {
    return "needs_support";
  }

  if (
    containsAny(combined, [
      "identity",
      "becoming",
      "rebuild",
      "rebuilding",
      "new version",
      "who i am",
    ])
  ) {
    return "identity_rebuild";
  }

  if (
    containsAny(combined, [
      "truth",
      "honest",
      "resistance",
      "resist",
      "hard to admit",
      "not ready to see",
    ])
  ) {
    return "truth_resistance";
  }

  if (
    containsAny(combined, [
      "power",
      "choice",
      "choose",
      "worth",
      "value",
      "non negotiable",
      "boundaries",
    ])
  ) {
    return "power_return";
  }

  if (
    containsAny(combined, [
      "ready",
      "commit",
      "committed",
      "decide",
      "action",
      "execute",
      "move",
      "start",
    ])
  ) {
    return "ready_for_next_step";
  }

  return "general";
}

export function determineDoor(response_category: string): Door {
  switch (response_category) {
    case "self_abandonment":
    case "identity_rebuild":
      return "rebuilding";

    case "avoidance":
    case "truth_resistance":
      return "stuck";

    case "overwhelm":
    case "needs_support":
      return "rest";

    case "needs_clarity":
      return "clarity";

    case "power_return":
      return "power";

    case "ready_for_next_step":
      return "inconsistent";

    default:
      return "lost";
  }
}

export function determineAction(response_category: string) {
  switch (response_category) {
    case "needs_clarity":
      return "send_clarity_email";

    case "ready_for_next_step":
      return "send_next_step_offer";

    case "needs_support":
    case "overwhelm":
      return "send_support_message";

    case "self_abandonment":
    case "identity_rebuild":
      return "send_identity_reset";

    case "avoidance":
    case "truth_resistance":
      return "send_pattern_interrupt";

    case "power_return":
      return "send_sovereign_action";

    default:
      return "manual_review";
  }
}

export function determinePathway(response_category: string): Pathway {
  switch (response_category) {
    case "self_abandonment":
      return "return-to-self";

    case "avoidance":
      return "pattern-break";

    case "overwhelm":
      return "restore-rhythm";

    case "needs_support":
      return "guided-support";

    case "needs_clarity":
      return "self-directed";

    case "identity_rebuild":
      return "identity-reset";

    case "truth_resistance":
      return "choose-again";

    case "power_return":
      return "sovereign-action";

    case "ready_for_next_step":
      return "next-step";

    default:
      return "rebuild-foundation";
  }
}

function pickVariation(options: string[], seed: string) {
  const index =
    seed
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0) % options.length;

  return options[index];
}

export function buildNextInstruction({
  door,
  pathway,
  response_category,
}: {
  door: string;
  pathway: string;
  response_category: string;
}) {
  const seed = `${door}-${pathway}-${response_category}-${Date.now()}`;

  const instructions: Record<string, string[]> = {
    self_abandonment: [
      "You do not need to punish yourself for where you left yourself.\n\nYou need to return without drama.\n\nToday, choose one act that proves you are no longer abandoning yourself.",
      "The pattern is not your identity.\n\nIt is information.\n\nName where you gave yourself away, then take one small action that brings you back.",
      "Do not make this a shame story.\n\nMake it a return point.\n\nOne honest choice today is enough to interrupt the old agreement.",
    ],

    avoidance: [
      "The delay is speaking.\n\nDo not argue with it. Decode it.\n\nChoose the smallest honest action and complete it before the day ends.",
      "Avoidance often protects an old fear.\n\nThank it for trying to protect you.\n\nThen move anyway, but smaller.",
      "You do not need a perfect plan.\n\nYou need one completed action.\n\nMake it visible. Make it real. Finish it.",
    ],

    overwhelm: [
      "Your system is asking for order, not pressure.\n\nLower the noise.\n\nChoose one thing to complete and one thing to release today.",
      "Do not force clarity from a flooded mind.\n\nPause. Breathe. Simplify.\n\nYour next step is the one that restores your capacity.",
      "You are carrying too many open loops.\n\nClose one.\n\nNot all of them. One.",
    ],

    needs_clarity: [
      "You don’t need more information.\n\nSomething is already clear.\n\nDecide what matters now and take one step you can actually complete.",
      "Clarity is not arriving because you keep negotiating with what you already know.\n\nWrite the truth in one sentence.\n\nThen act on that sentence.",
      "The answer is not hiding.\n\nIt is waiting for your agreement.\n\nChoose the next honest move.",
    ],

    needs_support: [
      "You are not meant to hold this alone.\n\nStay with what surfaced.\n\nDo not rush to solve it. Let support become part of the path.",
      "Support is not weakness.\n\nIt is structure.\n\nName what you need and allow one person, tool, or system to help carry it.",
      "You do not have to force your way forward.\n\nLet this be guided.\n\nYour next move is to stop isolating around the truth.",
    ],

    identity_rebuild: [
      "You are not repairing the old version.\n\nYou are building from truth.\n\nChoose one habit that belongs to who you are becoming.",
      "The rebuild does not need to be loud.\n\nIt needs to be consistent.\n\nToday, act like the version of you who no longer abandons the mission.",
      "Identity changes through evidence.\n\nGive yourself one piece of evidence today.",
    ],

    truth_resistance: [
      "The resistance is not random.\n\nIt is guarding a truth.\n\nDo not fight it. Ask what it is trying not to let you say.",
      "Something in you already knows.\n\nThe work is not to discover it.\n\nThe work is to stop bargaining with it.",
      "Truth does not always arrive gently.\n\nBut it does arrive to free you.\n\nWrite the sentence you keep avoiding.",
    ],

    power_return: [
      "Your power returns when your choices match your worth.\n\nChoose one boundary.\n\nHonor it without explaining it to death.",
      "This is not about control.\n\nIt is about ownership.\n\nTake one action today that proves you are back in your own authority.",
      "You named what is non-negotiable.\n\nNow let your behavior agree with it.",
    ],

    ready_for_next_step: [
      "You already have traction.\n\nStay consistent with what you started.\n\nExecution now matters more than reflection.",
      "Do not overcomplicate the next move.\n\nChoose the action that creates proof.\n\nComplete it.",
      "Readiness becomes real through movement.\n\nTake the next step before your mind turns it into a debate.",
    ],

    general: [
      "Stay with your return.\n\nThe next step will reveal itself through action.",
      "Something shifted because you showed up.\n\nDo not dismiss that.\n\nChoose one grounded action and complete it.",
      "You are closer than you think.\n\nDo the next true thing.",
    ],
  };

 const selected = pickVariation(
  instructions[response_category] ?? instructions.general,
  seed
);

// IDENTITY
const identityOptions: Record<string, string[]> = {
  needs_support: [
    "You are carrying more than you should alone.",
    "Something heavy surfaced, and it matters.",
    "You did not imagine this. It is real."
  ],
  needs_clarity: [
    "Something is trying to become clear.",
    "You are closer to the truth than you think.",
    "This is not confusion. It is emerging clarity."
  ],
  ready_for_next_step: [
    "You are closer to movement than you think.",
    "You already have traction.",
    "This is the edge of action."
  ],
  general: [
    "You named something real.",
    "Something important surfaced.",
    "This moment matters more than it looks."
  ]
};

const identitySet =
  identityOptions[response_category] || identityOptions.general;
  
let identity =
  identitySet[Math.floor(Math.random() * identitySet.length)];

// INTERROGATION
const interrogationOptions: Record<string, string[]> = {
  self_abandonment: [
    "Where did you leave yourself in this?",
    "What are you tolerating that you already know is not right?",
    "If you were fully on your own side, what would change immediately?"
  ],
  avoidance: [
    "What are you delaying that actually requires action?",
    "What are you pretending needs more time?",
    "If you acted today, what would you do first?"
  ],
  overwhelm: [
    "What is actually essential here?",
    "What can be removed immediately?",
    "What is one thing that would reduce the pressure right now?"
  ],
  needs_clarity: [
    "What do you already know but keep questioning?",
    "If you stopped negotiating, what would you decide?",
    "What is the simplest truth in front of you?"
  ],
  needs_support: [
    "What are you trying to carry alone?",
    "Who or what could support you if you allowed it?",
    "What would change if you stopped isolating around this?"
  ],
  ready_for_next_step: [
    "What action are you avoiding taking?",
    "What would forward movement look like today?",
    "What is the next step you already know?"
  ],
  general: [
    "What is actually true right now?",
    "What are you avoiding naming?",
    "What wants your attention that you keep pushing away?"
  ]
};

const interrogationSet =
  interrogationOptions[response_category] || interrogationOptions.general;

const interrogation =
  interrogationSet[Math.floor(Math.random() * interrogationSet.length)];

// FINAL OUTPUT
return `
${identity}

${interrogation}

${selected}
`;
}