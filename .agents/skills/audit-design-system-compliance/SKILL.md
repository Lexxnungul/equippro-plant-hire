---
name: audit-design-system-compliance
description: Audits the repository for raw hex colors, arbitrary CSS values, missing non-color error indicators, and invalid typography roles.
---

# audit-design-system-compliance

## Purpose
Scan the codebase to detect and report violations of Material Design 3 token usage, WCAG accessibility rules, and hardcoded styling literals.

## Required References
* `docs/design-rules.md` for prohibited raw values, semantic variable naming, and accessibility rules.
* `docs/ide-rules.md` for non-interactive command execution.

## Procedure

1. Search for raw hex color strings across all application source files:
   ```bash
   grep -rnE "#[0-9a-fA-F]{3,6}" src/ --exclude-dir=tokens --exclude="*.json"