---
name: scaffold-m3-accessible-field
description: Scaffolds a Material Design 3 form input field with accessible label pairings, error containers, inline SVG caution icons, and a synchronized Zod validation schema.
---

# scaffold-m3-accessible-field

## Purpose
Generate a new form input field with synchronized client-side markup, accessibility attributes, non-color error indicators, and server-side Zod validation boundaries.

## Required References
* `docs/design-rules.md` for semantic CSS variable names and the three-part error pattern.
* `docs/validation-rules.md` for Zod boundary schemas and regex formatting.

## Procedure

1. Collect the target field requirements:
   * Target form component path.
   * Field name in camelCase.
   * Label text.
   * Input type (`text`, `email`, `tel`, `number`, `password`).
   * Validation rules (minimum length, maximum length, required status, pattern regex).

2. Open the schema file in `src/lib/validation/` corresponding to the target form.

3. Append the field schema definition to the Zod object using `.trim()`, type constraints, and explicit error messages. If the field is a phone number, chain the E.164 transform rule. If the field is a CAC number, apply the uppercase transform and CAC regex.

4. Export the inferred TypeScript type from the updated Zod schema.

5. Open the target React form component file in `src/components/` or `src/app/`.

6. Insert the field container wrapper using CSS token classes:
   * Container background: `var(--color-surface-container)`.
   * Default border: `var(--color-outline)`.
   * Focus border: `var(--color-primary)`.
   * Error border: `var(--color-error)`.

7. Define the `<label>` element with a distinct `htmlFor` attribute matching the input `id`.

8. Define the `<input>` element with matching `id`, `name`, `type`, and standard value/change bindings.

9. Add dynamic accessibility attributes to the `<input>` element:
   * Set `aria-required="true"` if the field is mandatory.
   * Set `aria-invalid={hasError ? "true" : "false"}` based on form validation state.
   * Set `aria-describedby={hasError ? "${fieldId}-error" : undefined}`.

10. Insert the non-color visual error indicator next to the input:
    * Render an inline SVG warning icon that appears only when `hasError` is true.
    * Use `var(--color-error)` for the icon fill.

11. Insert the programmatic error message element directly beneath the input container:
    * Set `id="${fieldId}-error"`.
    * Set `role="alert"`.
    * Style text color using `var(--color-error)`.
    * Display the dynamic error string returned by Zod.

12. Run the terminal verification command to verify type safety:
    ```bash
    npm run build --noEmit
    ```

13. Confirm the compiler outputs zero type errors for the updated form.