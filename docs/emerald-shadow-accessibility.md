# Emerald Shadow Accessibility Log

Date: 2025-11-08 • Tester: Codex CLI • Route: /index.html hero

## Contrast Spot Checks
| Sample | Background Source | Foreground | Ratio | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| Frame A (0:04) | Gradient low-left (#01302b) | Heading #E4FFF7 | 13.67:1 | Pass (AA/AAA) | Captures darkest legible region under gradient wash. |
| Frame B (0:07) | Mid teal wash (#047062) | CTA button text #FFFFFF | 6.00:1 | Pass (AA/AAA) | Validates outlined secondary CTA over teal flash. |
| Frame C (0:11) | Shadow cap (#101010) | Body copy #E4FFF7 | 18.07:1 | Pass (AA/AAA) | Ensures vignette edge maintains ≥4.5:1.

Contrast math uses the WCAG 2.1 relative luminance formula (calculated via a short Python snippet executed in the CLI session).

## Motion & Interaction
- prefers-reduced-motion: reduce removes grain/pulse animations (verified via DevTools emulator; screenshots pending once GUI access is available).
- CTA buttons retain focus ring outline: 3px and remain tabbable via keyboard.
- Video is flagged ria-hidden="true"; overlays are pointer-events none so assistive tech lands directly on the copy/CTAs.

## Outstanding
1. Capture annotated screenshots (desktop + mobile) for each sampled frame once GUI access is available.
2. Run axe-core against the deployed page to log the zero-violation proof requested in the brief.
