# Build Plan: Ridged-noise mountain chains on the globe

## Task
Replace the current blobby, random-peak terrain with structured, chain-like mountain systems (similar to the Rockies/Andes) using ridged noise applied in latitude bands on the globe sphere.

## Current Implementation
- `src/app/terminal-input/terminal-input.component.ts` contains all terrain generation:
 - `hash(x,y,z)` (155–162), `smooth(t)` (167–169), `noise3D(x,y,z)` (174–203) as noise primitives.
 - `fbm(x,y,z)` (208–224):4-octave value-noise FBM (`lacunarity=2.0`, `gain=0.5`) used for base elevation.
 - `renderSphere()` (266–272): samples `fbm(theta/PI, phi/PI,0.5)` to get elevation, normalizes to ~[0,1].
 - `SEA_LEVEL =0.42`, `HEIGHT_DISPLACEMENT =2.0`;8 color classes (`orb-c0`–`orb-c7`) for ocean→peak coloring.
- Current terrain is smooth and blobby because FBM on value noise creates isotropic "hills", not linear ridges.

## File Changes
- [modify] src/app/terminal-input/terminal-input.component.ts — add ridged-noise method, latitude-band weighting, and integrate into elevation computation in `renderSphere()`.

## Assumptions
- The existing8-step color classes (`orb-c0`–`orb-c7`) are sufficient; mountain chains will appear as higher-elevation segments naturally mapped to `orb-c6`/`orb-c7`.
- Performance budget allows3–4 octave ridged-noise calls per vertex (same order as current FBM).
- Continents should remain deterministic and visually similar; ridged noise adds structure on top, it doesn't rewrite the landmass shapes entirely.
- Latitude mapping: `phi ≈0` (north pole), `phi ≈ PI/2` (equator), `phi ≈ PI` (south pole); mountain bands should sit around20–60° N/S (roughly `phi ≈1.0–2.0` and `phi ≈4.2–5.1`).

## Rollback Notes
- Revert the single modified file (`src/app/terminal-input/terminal-input.component.ts`) to its previous commit. All changes are additive (new method + updated elevation formula) and localized within this component, so `git checkout` or UI undo is straightforward.

## Definition of Done
- Globe renders with visible, chain-like mountain ridges (linear/curved bands) instead of scattered random peaks.
- Mountain chains are concentrated in mid-latitude bands, not uniformly distributed.
- Build succeeds with no TypeScript errors and no regression in globe rendering.

## Action Steps
<!-- step-id: step-1 -->
- [x] Implement ridged-noise mountain generator and integrate into elevation
 - **Files:** src/app/terminal-input/terminal-input.component.ts
 - **Approach:**
 - Add `ridgedMountainNoise(theta: number, phi: number): number` method below `fbm()`:
 - Use the existing `noise3D` and `smooth`/`hash` infrastructure.
 - For3–4 octaves, compute `signal =1 - Math.abs(noise3D(...))`, raise to a power (e.g.2.0–3.0) to sharpen ridges, then accumulate with standard FBM-style amplitude/frequency scaling.
 - Include a longitude-bias so ridges stretch along meridians (e.g. sample with elongated frequency along `theta` vs `phi`).
 - Add a latitude-band weight function:
 - Map `phi` to latitude in radians: `lat = PI/2 - phi`.
 - Compute a banding weight that peaks around |lat| ≈20–60° (e.g. using `smooth` or Gaussian-like falloff), near-zero at equator and poles.
 - In `renderSphere()`, after computing `baseElevation = fbm(...)`:
 - Compute `ridge = ridgedMountainNoise(theta, phi)`.
 - Compute `latWeight = latitudeBandWeight(phi)`.
 - Blend: `combinedElevation = baseElevation + latWeight * ridge * MOUNTAIN_STRENGTH` (e.g. `MOUNTAIN_STRENGTH ≈0.2–0.35`).
 - Clamp `normalizedElevation` to `[0,1]` so existing color classes and `SEA_LEVEL` logic continue to work unchanged.
 - Tune constants (`MOUNTAIN_STRENGTH`, ridge power, octave counts) visually via a quick build/run.
 - **Acceptance criteria:**
 - New `ridgedMountainNoise` and latitude-band weight functions exist and are called from `renderSphere()`.
 - Globe visibly shows elongated mountain ridges concentrated in mid-latitude bands.
 - No TypeScript compilation errors.
 - **Verification:**
 - `npm run build` (or `ng build`) succeeds with no errors.
 - Run dev server (`ng serve`) and visually inspect the globe for chain-like mountain structures.
 - **Risks:**
 - Overly aggressive `MOUNTAIN_STRENGTH` or ridge power can wash out continents or make terrain look spiky; keep blending additive and clamp to [0,1].
 - Extra per-vertex noise calls may impact render performance on low-end devices; limit to3 octaves for ridged noise if needed.

<!-- step-id: step-2 -->
- [x] Validate build and visual outcome
 - **Files:** src/app/terminal-input/terminal-input.component.ts
 - **Approach:**
 - Run a clean build to confirm no regressions.
 - Optionally run unit tests if present (`ng test` or `npm test`) to ensure no broken specs.
 - If mountains look too weak or too strong, adjust `MOUNTAIN_STRENGTH`, ridge power, or latitude-band width within the same step.
 - **Acceptance criteria:**
 - Build and tests pass.
 - Globe displays structured, chain-like mountain ranges in plausible latitude bands, with continents still recognizable.
 - **Verification:**
 - `npm run build` (or `ng build`) exits cleanly.
 - Visual check on served app confirms the desired mountain-chain appearance.
 - **Risks:**
 - If tests exist and are brittle to rendering timing, they may need minor adjustments unrelated to terrain logic.
