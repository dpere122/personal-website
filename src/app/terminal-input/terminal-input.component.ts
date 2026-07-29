import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  expanded?: boolean;
}

export interface ResumeData {
  summary: string;
  experiences: Experience[];
  education: {
    degree: string;
    school: string;
    location: string;
    period: string;
  };
  skills: {
    category: string;
    items: string;
  }[];
}

/**
 * Terminal Input Component
 *
 * Procedurally renders a rotating ASCII sphere using 3D math:
 * - Parametric sphere points (θ, φ → x, y, z)
 * - Rotation matrix around the Y-axis
 * - Perspective projection to 2D
 * - Lambertian shading from an upper-left-front light source
 *
 * Features:
 * - Frame-by-frame ASCII orb animation
 * - Configurable frame duration
 * - Responsive height that can be controlled by parent component
 * - Terminal-like appearance with gradient background
 * - Optional height adjustment for scroll effects
 * - Resume content display in terminal style
 *
 * Usage:
 * <app-terminal-input
 *   [originalBoxHeight]="60"
 *   [minBoxHeight]="30"
 *   [enableHeightChanges]="true"
 *   [frameDuration]="180"
 *   [resumeData]="resumeData">
 * </app-terminal-input>
 */
@Component({
  selector: "app-terminal-input",
  templateUrl: "./terminal-input.component.html",
  styleUrls: ["./terminal-input.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class TerminalInputComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** Default height of the terminal box in pixels */
  @Input() originalBoxHeight: number = 60;

  /** Minimum height the box can shrink to when scrolling */
  @Input() minBoxHeight: number = 30;

  /** Whether to enable height changes when parent component scrolls */
  @Input() enableHeightChanges: boolean = true;

  /** Frame duration in milliseconds */
  @Input() frameDuration: number = 180;

  /** Resume data to display in terminal style */
  @Input() resumeData?: ResumeData;

  /** Current frame string being displayed */
  currentFrame: string = "";

  // Animation configuration
  private animationTimer: any = null;

  // Sphere parameters
  private readonly RADIUS: number = 12;
  private readonly STEP: number = 0.011;
  private readonly FOV: number = 60;
  private readonly ORIGIN_X: number = 20;
  private readonly ORIGIN_Y: number = 12;

  // Horizontal stretch so the projected sphere reads round in monospace cells
  // (cell height ≈ line-height × font-size, width ≈ 0.6 × font-size)
  private readonly CELL_ASPECT: number = 1.75;

  // Normalized light direction — upper-left-front for readable terminal shading
  private readonly LIGHT_X: number = -0.45;
  private readonly LIGHT_Y: number = 0.82;
  private readonly LIGHT_Z: number = 0.35;
  private readonly AMBIENT: number = 0.32;
  private readonly BRIGHTNESS: number = 1.2;
  private readonly SHADE_GAMMA: number = 0.78;

  // Shading ramp — shadow to highlight (trimmed dark end for a brighter look)
  private readonly SHADING: string[] = [
    " ",
    "·",
    ".",
    ":",
    "-",
    "=",
    "~",
    "+",
    "*",
    "x",
    "o",
    "O",
    "%",
    "#",
    "@",
  ];

  // Current rotation angle (radians)
  private angleY: number = 0;
  private angleX: number = 0;

  constructor() {}

  ngOnInit(): void {
    // No initialization needed
  }

  ngAfterViewInit(): void {
    this.startAnimation();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  private startAnimation(): void {
    this.animationTimer = setInterval(() => {
      this.angleY += 0.12;
      // Oscillate angleX gently so the silhouette stays close to a circle
      this.angleX = Math.sin(Date.now() * 0.001) * 0.15;
      this.currentFrame = this.renderSphere();
    }, this.frameDuration);
  }

  private stopAnimation(): void {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  /**
   * Generates one frame of the ASCII sphere.
   *
   * For each point on the parametric sphere:
   *   1. Compute (x, y, z) from (θ, φ)
   *   2. Rotate around Y-axis by angleY
   *   3. Rotate around X-axis by angleX
   *   4. Project to 2D screen coordinates
   *   5. Shade by Lambertian dot(normal, light)
   *   6. Write the shading character at that (row, col) if z is closer
   *      than what's already there
   */
  private renderSphere(): string {
    // Buffers: one char grid and one z-depth grid
    const rows = this.ORIGIN_Y * 2 + 2;
    const cols = this.ORIGIN_X * 2 + 2;

    const outputBuffer: string[][] = [];
    const zBuffer: number[][] = [];

    for (let r = 0; r < rows; r++) {
      outputBuffer[r] = [];
      zBuffer[r] = [];
      for (let c = 0; c < cols; c++) {
        outputBuffer[r][c] = " ";
        zBuffer[r][c] = -Infinity;
      }
    }

    const lightLen = Math.hypot(this.LIGHT_X, this.LIGHT_Y, this.LIGHT_Z);
    const lx = this.LIGHT_X / lightLen;
    const ly = this.LIGHT_Y / lightLen;
    const lz = this.LIGHT_Z / lightLen;

    // Iterate over the sphere surface
    for (let theta = 0; theta < Math.PI * 2; theta += this.STEP) {
      for (let phi = 0.08; phi < Math.PI - 0.08; phi += this.STEP) {
        // Parametric sphere point (unit sphere → scale by radius)
        let x = this.RADIUS * Math.sin(phi) * Math.cos(theta);
        let y = this.RADIUS * Math.cos(phi);
        let z = this.RADIUS * Math.sin(phi) * Math.sin(theta);

        // Rotate around Y-axis
        const cosY = Math.cos(this.angleY);
        const sinY = Math.sin(this.angleY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        x = x1;
        z = z1;

        // Rotate around X-axis (gentle tilt)
        const cosX = Math.cos(this.angleX);
        const sinX = Math.sin(this.angleX);
        const y1 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y1;
        z = z2;

        // Skip back-facing points
        if (z < 0) {
          continue;
        }

        // Perspective projection with terminal cell aspect correction
        const ooz = this.FOV / (this.FOV + z);
        const xp = Math.round(this.ORIGIN_X + ooz * x * this.CELL_ASPECT);
        const yp = Math.round(this.ORIGIN_Y - ooz * y);

        // Bounds check
        if (xp >= 0 && xp < cols && yp >= 0 && yp < rows) {
          // Lambertian shading from surface normal (sphere centered at origin)
          const nx = x / this.RADIUS;
          const ny = y / this.RADIUS;
          const nz = z / this.RADIUS;
          const diffuse = Math.max(0, nx * lx + ny * ly + nz * lz);
          const raw = this.AMBIENT + (1 - this.AMBIENT) * diffuse;
          const intensity = Math.min(
            1,
            Math.pow(raw * this.BRIGHTNESS, this.SHADE_GAMMA),
          );
          const shadeIndex = Math.min(
            this.SHADING.length - 1,
            Math.floor(intensity * (this.SHADING.length - 1)),
          );
          const char = this.SHADING[shadeIndex];

          // Only write if this point is closer than what's already buffered
          if (z > zBuffer[yp][xp]) {
            zBuffer[yp][xp] = z;
            outputBuffer[yp][xp] = char;
          }
        }
      }
    }

    // Find the widest row (the "equator" of the sphere)
    let widestCount = 0;
    let widestRow = 0;
    for (let r = 0; r < rows; r++) {
      const count = outputBuffer[r].filter((c) => c !== " ").length;
      if (count > widestCount) {
        widestCount = count;
        widestRow = r;
      }
    }

    // Equator bounds — fixed horizontal frame for every row
    let equatorLeft = cols;
    let equatorRight = -1;
    for (let c = 0; c < cols; c++) {
      if (outputBuffer[widestRow][c] !== " ") {
        if (c < equatorLeft) equatorLeft = c;
        if (c > equatorRight) equatorRight = c;
      }
    }
    if (equatorRight < 0) return "";

    // Collect rows belonging to the main cluster
    const maxDistance = Math.ceil(this.RADIUS * 1.2);
    const includedRows: number[] = [];

    for (let r = 0; r < rows; r++) {
      if (Math.abs(r - widestRow) > maxDistance) continue;

      let nonSpaceCount = 0;
      for (let c = 0; c < cols; c++) {
        if (outputBuffer[r][c] !== " ") nonSpaceCount++;
      }
      if (nonSpaceCount < 2) continue;

      includedRows.push(r);
    }

    if (includedRows.length === 0) return "";

    // Slice each row to the equator width (preserves projected positions)
    let result = "";
    for (const r of includedRows) {
      result +=
        outputBuffer[r].slice(equatorLeft, equatorRight + 1).join("") + "\n";
    }
    // trimEnd only — trim() would strip leading spaces from the first row
    return result.trimEnd();
  }

  /**
   * Updates the height of the gradient box
   * Called by the parent component during scroll events.
   *
   * @param height - The new height in pixels
   */
  updateBoxHeight(height: number): void {
    if (!this.enableHeightChanges) return;

    const gradientBox = document.querySelector(".gradient-box") as HTMLElement;
    if (gradientBox) {
      gradientBox.style.height = `${height}px`;
    }
  }

  /**
   * Toggle expansion of an experience item
   */
  toggleExperience(exp: Experience): void {
    exp.expanded = !exp.expanded;
  }
}
