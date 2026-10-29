Trigger: Glob
Trigger Pattern: src/app/**/*.tsx, src/components/**/*.tsx, src/styles/**/*.css

Never write raw hex color codes in UI components.
Use only semantic CSS custom properties defined in the design system.
Reason: Raw hex codes prevent global theme updates and break dark mode support.

Anchor all color roles to Industrial Forge Rust (#9A3412) pinned at Tone 40.
Generate all secondary and tertiary roles from this primary anchor.
Reason: Pinning Tone 40 preserves brand recognition across theme changes.

Maintain a contrast ratio of at least 7 to 1 for body text.
Test Light Mode text using Tone 10 text on Tone 98 surfaces.
Reason: Site managers read equipment screens outdoors under direct sunlight and high glare.

Never communicate errors with color alone.
Combine an error border with an SVG alert icon and explanatory text.
Reason: Site managers with color vision deficiency need distinct visual cues to spot form errors.

Layout and Typography Rules

Define button sizes with padding in rem units.
Never set fixed pixel widths or heights on buttons.
Reason: Fixed button dimensions cause translated or zoomed text to clip.

Scale display titles using responsive clamp formulas.
Set display text to clamp(2.25rem, 4vw + 1rem, 3.5rem).
Reason: Display headings must fit mobile screens without awkward line wraps.