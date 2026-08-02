# Build Plan: Add Ice Caps to Terminal Sphere Visualization

## Task
Add polar ice caps to the 3D sphere rendered in the terminal-input component, based on latitude (phi), with a moderate appearance.

## Current Implementation
The sphere in src/app/terminal-input/terminal-input.component.ts uses phi (0 to PI) and normalizedElevation to color tiles as ocean (orb-c0..c3) or land (orb-c4..c7). CSS classes are defined in terminal-input.component.css with :host ::ng-deep selectors. No latitude-based ice cap logic or ice color classes exist yet.

## File Changes
- [modify] src/app/terminal-input/terminal-input.component.css — Add .orb-ice and .orb-ice-edge color classes styled consistently with existing orb-c* pattern (:host ::ng-deep with !important).
- [modify] src/app/terminal-input/terminal-input.component.ts — In renderSphere(), after computing phi, insert latitude-based ice cap logic (ICE_LAT=0.30, ICE_EDGE_LAT=0.55) that overrides the existing ocean/land colorIndex selection near the poles.

## Assumptions
- ICE_LAT=0.30 and ICE_EDGE_LAT=0.55 are the desired thresholds based on user clarification.
- Ice caps should be symmetric (same behavior near phi=0 and phi=PI).
- Ice color classes should use white/light-cyan tones to contrast with the dark background and blue/green terrain.
- Existing SEA_LEVEL and ocean/land logic should remain intact for non-ice regions.
- Angular CLI dev server can be used to visually verify the result.

## Rollback Notes
Revert both files to their pre-change state (git checkout or restore from backup). The changes are localized to one component and do not affect routing, services, or other components.

## Definition of Done
- Ice cap color classes (.orb-ice, .orb-ice-edge) are defined in terminal-input.component.css.
- renderSphere() applies ice classes based on phi thresholds (0.30 / 0.55) overriding ocean/land colors.
- No TypeScript compilation errors.
- Build succeeds with `ng build`.
- Ice caps are visibly present at both poles when running the dev server.

## Action Steps
<!-- step-id: step-1 -->
- [x] Add ice cap color classes to the terminal-input component CSS.
  - **Files:** src/app/terminal-input/terminal-input.component.css
  - **Approach:** Append two new :host ::ng-deep rules after the existing orb-c* color classes: .orb-ice (bright white) and .orb-ice-edge (light cyan/white blend), matching the existing pattern with color/font-weight and !important.
  - **Acceptance criteria:**
    - .orb-ice class exists with a white/bright color.
    - .orb-ice-edge class exists with a lighter transition color.
    - Selectors use :host ::ng-deep and !important like existing orb classes.
  - **Verification:** Check file visually or grep for '.orb-ice' and '.orb-ice-edge' in the CSS file.
  - **Risks:**
    - Mismatched selector syntax could prevent styles from applying; mitigate by copying exact pattern from existing orb-c* rules.
<!-- step-id: step-2 -->
- [x] Add latitude-based ice cap logic to renderSphere().
  - **Files:** src/app/terminal-input/terminal-input.component.ts
  - **Approach:** In renderSphere(), after phi is computed and before the ocean/land colorIndex decision, add constants ICE_LAT=0.30 and ICE_EDGE_LAT=0.55. If phi < ICE_LAT or phi > PI-ICE_LAT → use class 'orb-ice'. Else if phi < ICE_EDGE_LAT or phi > PI-ICE_EDGE_LAT → use class 'orb-ice-edge'. Otherwise fall through to existing SEA_LEVEL logic.
  - **Acceptance criteria:**
    - ICE_LAT and ICE_EDGE_LAT constants are defined.
    - Ice classes override ocean/land classes near both poles.
    - Existing ocean/land coloring is unchanged for mid-latitudes.
    - No TypeScript syntax or type errors.
  - **Verification:** Run `ng build` and confirm zero errors; optionally run `ng serve` to visually verify ice caps appear at both poles.
  - **Risks:**
    - Placing the ice logic in the wrong branch could break ocean/land rendering; mitigate by inserting before the SEA_LEVEL conditional and preserving its original structure.
<!-- step-id: step-3 -->
- [x] Validate the full change compiles and runs without errors.
  - **Approach:** Run `ng build` to confirm the project compiles cleanly with the new CSS classes and TS logic. Optionally start `ng serve` for a quick visual sanity check.
  - **Acceptance criteria:**
    - `ng build` exits with code 0.
    - No LSP diagnostics or build warnings related to terminal-input.
    - Ice caps are visually visible at both poles (if dev server is checked).
  - **Verification:** Run `ng build` from workspace root; inspect output for errors.
