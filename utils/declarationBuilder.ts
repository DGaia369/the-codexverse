/**
 * the codeXverse™ — First Inheritance™ Personalization
 *
 * Builds "The Evidence You Carried Through" page and inserts it into
 * the existing static declaration.pdf, between page 3 (Before We
 * Begin) and page 4 (Part One: The Interruption).
 *
 * Nothing in the existing 16-page PDF is altered. This module only
 * generates ONE new page and merges it into the existing document at
 * send time, in memory, returning a buffer ready for the Resend
 * attachment.
 *
 * Visual values were sampled directly from the existing
 * declaration.pdf interior pages to match exactly:
 *   - background: #F3EAD7
 *   - heading / body text: near-black serif
 *   - footer: muted gray-brown, italic, centered
 *
 * Mapping (locked, do not change):
 *   q1_completed      -> "What you completed:"
 *   q2_resistance     -> "What resisted:"
 *   q3_changed        -> "What changed:"
 *   q4_truth_revealed -> "What was revealed:"
 *   q5_non_negotiable -> "What became non-negotiable:"
 */

import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFFont,
  PDFPage,
} from "pdf-lib";

// ---- Sampled visual constants (do not change without re-sampling source PDF) ----

const BG_COLOR = rgb(243 / 255, 234 / 255, 215 / 255); // #F3EAD7
const TEXT_COLOR = rgb(20 / 255, 20 / 255, 20 / 255);
const LABEL_COLOR = rgb(40 / 255, 38 / 255, 34 / 255);
const QUOTE_COLOR = rgb(45 / 255, 42 / 255, 38 / 255);
const FOOTER_COLOR = rgb(0x8e / 255, 0x8a / 255, 0x85 / 255);

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const MARGIN_LEFT = 79;
const MARGIN_RIGHT = 79;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

interface EvidenceInputs {
  q1Completed?: string | null;
  q2Resistance?: string | null;
  q3Changed?: string | null;
  q4TruthRevealed?: string | null;
  q5NonNegotiable?: string | null;
}

function safe(value: string | null | undefined): string {
  if (value === null || value === undefined) return "Not named yet.";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Not named yet.";
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const rawLines = text.split("\n");

  for (const rawLine of rawLines) {
    const words = rawLine.split(" ");
    let current = "";

    for (const word of words) {
      const trial = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(trial, size);

      if (width <= maxWidth) {
        current = trial;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

/**
 * Builds the single "Evidence" page inside a fresh PDFDocument and
 * returns that document, ready to have its page copied into the
 * main declaration document.
 */
async function buildEvidencePageDoc(
  inputs: EvidenceInputs
): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const fontBody = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: BG_COLOR,
  });

  let y = PAGE_HEIGHT - 100;

  const drawLine = (
    text: string,
    font: PDFFont,
    size: number,
    color = TEXT_COLOR,
    x = MARGIN_LEFT
  ) => {
    page.drawText(text, { x, y, size, font, color });
    y -= size + 7;
  };

  // Heading
  page.drawText("The Evidence You Carried Through", {
    x: MARGIN_LEFT,
    y,
    size: 17,
    font: fontBold,
    color: TEXT_COLOR,
  });
  y -= 38;

  // Opening framing
  drawLine("You did not leave the same way you entered.", fontBody, 12);
  drawLine("Before this inheritance opens, pause here.", fontBody, 12);

  y -= 8;
  drawLine("This is what you named:", fontItalic, 12);
  y -= 18;

  const entries: [string, string][] = [
    ["What you completed:", safe(inputs.q1Completed)],
    ["What resisted:", safe(inputs.q2Resistance)],
    ["What changed:", safe(inputs.q3Changed)],
    ["What was revealed:", safe(inputs.q4TruthRevealed)],
    ["What became non-negotiable:", safe(inputs.q5NonNegotiable)],
  ];

  for (const [label, value] of entries) {
    // Label
    page.drawText(label, {
      x: MARGIN_LEFT,
      y,
      size: 12,
      font: fontBold,
      color: LABEL_COLOR,
    });
    y -= 18;

    // Quoted participant words -- exact, never rewritten
    const quoted = `\u201C${value}\u201D`;
    const wrapped = wrapText(quoted, fontItalic, 12, CONTENT_WIDTH - 12);

    for (const line of wrapped) {
      page.drawText(line, {
        x: MARGIN_LEFT + 12,
        y,
        size: 12,
        font: fontItalic,
        color: QUOTE_COLOR,
      });
      y -= 17;
    }

    y -= 16;

    if (y < 140) {
      // Safety valve: stop adding further entries gracefully rather
      // than overflowing the bottom margin if answers run unusually long.
      break;
    }
  }

  y -= 6;
  drawLine("This is not a report.", fontBody, 12);
  drawLine("This is not a performance record.", fontBody, 12);
  drawLine("This is the first evidence of your return.", fontBody, 12);

  y -= 10;
  page.drawText("Now continue.", {
    x: MARGIN_LEFT,
    y,
    size: 12,
    font: fontItalic,
    color: TEXT_COLOR,
  });

  // Footer
  const footerText = "the codeXverse\u2122 \u00B7 thecodeXverse.com";
  const footerSize = 9;
  const footerWidth = fontItalic.widthOfTextAtSize(footerText, footerSize);
  page.drawText(footerText, {
    x: (PAGE_WIDTH - footerWidth) / 2,
    y: 50,
    size: footerSize,
    font: fontItalic,
    color: FOOTER_COLOR,
  });

  return doc;
}

/**
 * Reads the static declaration.pdf (as a Buffer), builds the
 * Evidence page, and returns a new PDF (as a Buffer) with the
 * Evidence page inserted between page 3 ("Before We Begin", index 2)
 * and page 4 ("Part One: The Interruption", index 3).
 *
 * Page order after insertion:
 *   0: Cover
 *   1: the Declaration / A Gift from the codeXverse
 *   2: Before We Begin
 *   3: The Evidence You Carried Through   <-- NEW
 *   4: Part One: The Interruption
 *   ... (rest unchanged) ...
 *   16: Closing (Once you see it...)
 */
export async function buildPersonalizedDeclaration(
  basePdfBuffer: Buffer,
  inputs: EvidenceInputs
): Promise<Buffer> {
  const baseDoc = await PDFDocument.load(basePdfBuffer);
  const evidenceDoc = await buildEvidencePageDoc(inputs);

  const outputDoc = await PDFDocument.create();

  const basePageCount = baseDoc.getPageCount();
  const insertAfterIndex = 2; // 0-indexed: page[2] is "Before We Begin"

  // Copy pages 0 and 1 and 2 (Cover, Declaration intro, Before We Begin)
  const firstChunkIndices = Array.from(
    { length: insertAfterIndex + 1 },
    (_, i) => i
  );
  const firstChunkPages = await outputDoc.copyPages(
    baseDoc,
    firstChunkIndices
  );
  firstChunkPages.forEach((p) => outputDoc.addPage(p));

  // Insert the new Evidence page
  const [evidencePage] = await outputDoc.copyPages(evidenceDoc, [0]);
  outputDoc.addPage(evidencePage);

  // Copy the remaining original pages (Part One onward through closing)
  const remainingIndices = Array.from(
    { length: basePageCount - (insertAfterIndex + 1) },
    (_, i) => i + insertAfterIndex + 1
  );
  const remainingPages = await outputDoc.copyPages(baseDoc, remainingIndices);
  remainingPages.forEach((p) => outputDoc.addPage(p));

  const outputBytes = await outputDoc.save();
  return Buffer.from(outputBytes);
}
