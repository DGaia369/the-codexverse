# PDF Engine

**Status:** Implemented and active

## Purpose

Generate personalized Declaration™ PDFs without altering the static base PDF.

## Primary module

`utils/declarationBuilder.ts`

## Current responsibilities

- Load the static Declaration™ PDF.
- Insert “The Evidence You Carried Through.”
- Generate participant-authored writing pages.
- Preserve participant wording exactly.
- Add pages dynamically as required.
- Prevent orphaned section headings.
- Allow long answers to continue across pages.
- Insert completed writing before the final closing page.
- Return a buffer suitable for download or email attachment.

## Artifact relationship

The generated PDF is a Recognition Record™.

It is part of the Library of Yourself™.

## Current participant-facing heading

> Recognition Record™  
> Part of the Library of Yourself™

## Pagination rules

- Section heading must remain with the first prompt and opening answer lines.
- A prompt must remain with the opening of its answer.
- Long answers may continue naturally onto new pages.
- No participant writing should be truncated.
- Every generated page receives the established background and footer.

## Known follow-up

Verify final participant-facing heading and exact placement in the generated PDF after the next full-flow test.
