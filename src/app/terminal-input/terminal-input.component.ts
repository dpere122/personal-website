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
  private readonly STEP: number = 0.008;
  private readonly FOV: number = 90;
  private readonly ORIGIN_X: number = 20;
  private readonly ORIGIN_Y: number = 12;

  // Height displacement from elevation (subtle but visible)
  private readonly HEIGHT_DISPLACEMENT: number = 2.0;

  // Horizontal stretch so the projected sphere reads round in monospace cells
  // (cell height ≈ line-height × font-size, width ≈ 0.6 × font-size)
  private readonly CELL_ASPECT: number = 1.75;

  // Normalized light direction — slightly left and low for subtle shading
  private readonly LIGHT_X: number = -0.15;
  private readonly LIGHT_Y: number = 0.1;
  private readonly LIGHT_Z: number = 0.35;
  private readonly AMBIENT: number = 0.15;
  private readonly BRIGHTNESS: number = 1.0;
  private readonly SHADE_GAMMA: number = 0.78;
  // Shading ramp — shadow to highlight (dense characters for visibility)
  private readonly SHADING: string[] = ["░", "▒", "▓", "█"];

  // Noise seed for continent generation (fixed so continents stay the same)
  private readonly NOISE_SEED: number = 115;

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
      this.angleY += 0.24;
      // Fixed X-axis tilt (~23.5° like Earth's axial tilt)
      this.angleX = 0.41;
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
   * Simple hash function for deterministic noise
   */
  private hash(x: number, y: number, z: number): number {
    let n = x + y * 57 + z * 131 + this.NOISE_SEED;
    n = (n << 13) ^ n;
    return (
      1 -
      ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0
    );
  }

  /**
   * Smooth interpolation for value noise
   */
  private smooth(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * 3D value noise with octaves for Earth-like terrain
   */
  private noise3D(x: number, y: number, z: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;
    const u = this.smooth(xf);
    const v = this.smooth(yf);
    const w = this.smooth(zf);

    const n000 = this.hash(xi, yi, zi);
    const n100 = this.hash(xi + 1, yi, zi);
    const n010 = this.hash(xi, yi + 1, zi);
    const n110 = this.hash(xi + 1, yi + 1, zi);
    const n001 = this.hash(xi, yi, zi + 1);
    const n101 = this.hash(xi + 1, yi, zi + 1);
    const n011 = this.hash(xi, yi + 1, zi + 1);
    const n111 = this.hash(xi + 1, yi + 1, zi + 1);

    const x00 = n000 + u * (n100 - n000);
    const x10 = n010 + u * (n110 - n010);
    const x01 = n001 + u * (n101 - n001);
    const x11 = n011 + u * (n111 - n011);

    const xy0 = x00 + v * (x10 - x00);
    const xy1 = x01 + v * (x11 - x01);

    return xy0 + w * (xy1 - xy0);
  }

  /**
   * Multi-octave noise for realistic terrain
   */
  private fbm(x: number, y: number, z: number): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    const octaves = 4;
    const lacunarity = 2.0;
    const gain = 0.5;

    for (let i = 0; i < octaves; i++) {
      value +=
        amplitude * this.noise3D(x * frequency, y * frequency, z * frequency);
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return value;
  }
  // Mountain chain strength (additive boost over base terrain)
  private readonly MOUNTAIN_STRENGTH: number = 0.08;

  /**
   * Ridged noise for chain-like mountain ranges.
   *
   * Uses ridged multifractal: 1 - |noise|, sharpened by power, accumulated
   * across octaves. Sample frequencies are elongated along theta (longitude)
   * so ridges stretch into linear/curved bands instead of random peaks.
   */
  private ridgedMountainNoise(theta: number, phi: number): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    const octaves = 3;
    const lacunarity = 2.0;
    const gain = 0.5;
    const ridgePower = 1.2;

    // Elongation: lower frequency along theta so ridges form chains along
    // roughly meridian-like directions, higher along phi for variation.
    const thetaScale = 0.35;
    const phiScale = 1.0;

    for (let i = 0; i < octaves; i++) {
      const nx = theta * thetaScale * frequency;
      const ny = phi * phiScale * frequency;
      const nz = 0.5 + i * 0.1;

      // Invert absolute noise to create ridges along zero-crossings
      const signal = 1 - Math.abs(this.noise3D(nx, ny, nz));
      // Sharpen ridges by raising to power
      const sharpened = Math.pow(signal, ridgePower);

      value += amplitude * sharpened;
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return value;
  }

  /**
   * Latitude-band weight: peaks in mid-latitudes (~20-60° N/S),
   * near-zero at equator and poles. This concentrates mountain chains
   * in plausible bands (like Rockies/Andes, Alps, Himalayas).
   */
  private latitudeBandWeight(phi: number): number {
    // phi: 0 = north pole, PI/2 = equator, PI = south pole
    // lat: -PI/2 (south) to +PI/2 (north)
    const lat = Math.PI / 2 - phi;
    const absLat = Math.abs(lat);

    // Target band: |lat| ≈ 0.35-1.0 rad (20-60 degrees)
    const bandCenter = 0.7; // ~40 degrees
    const bandWidth = 0.55; // wider, smoother band

    // Gaussian-like falloff centered on bandCenter
    const dist = absLat - bandCenter;
    const weight = Math.exp(-0.5 * (dist / bandWidth) * (dist / bandWidth));

    return weight;
  }

  /**
   * Generates one frame of the ASCII Earth sphere.
   *
   * For each point on the parametric sphere:
   *   1. Sample terrain noise at (θ, φ) position
   *   2. Displace radius by elevation for height map effect
   *   3. Rotate around Y and X axes
   *   4. Project to 2D screen coordinates
   *   5. Color by elevation: blue for ocean, green for land
   *   6. Shade by Lambertian lighting
   *   7. Write colored span if z is closer than what's already there
   */
  private renderSphere(): string {
    // Buffers: HTML spans grid and z-depth grid
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

    // Ocean/land threshold (~70% ocean, ~30% land)
    const SEA_LEVEL = 0.42;

    // Iterate over the sphere surface
    for (let theta = 0; theta < Math.PI * 2; theta += this.STEP) {
      for (let phi = 0.08; phi < Math.PI - 0.08; phi += this.STEP) {
        // Sample base terrain noise at this (θ, φ) position (before any rotation)
        const noiseX = theta / Math.PI;
        const noiseY = phi / Math.PI;
        const noiseZ = 0.5;
        const baseElevation = this.fbm(noiseX, noiseY, noiseZ);
        // Normalize fbm output (~[-0.5, 0.5]) to [0, 1]
        let normalizedElevation = (baseElevation + 0.5) * 0.8;

        // Add ridged-noise mountain chains concentrated in mid-latitude bands
        const ridge = this.ridgedMountainNoise(theta, phi);
        const latWeight = this.latitudeBandWeight(phi);
        normalizedElevation =
          normalizedElevation + latWeight * ridge * this.MOUNTAIN_STRENGTH;
        // Clamp to [0, 1] so existing color classes and SEA_LEVEL logic remain valid
        normalizedElevation = Math.max(0, Math.min(1, normalizedElevation));

        // Displace radius by elevation: ocean dips, land rises
        const displacedRadius =
          this.RADIUS + (normalizedElevation - 0.5) * this.HEIGHT_DISPLACEMENT;

        // Parametric sphere point with displaced radius
        let x = displacedRadius * Math.sin(phi) * Math.cos(theta);
        let y = displacedRadius * Math.cos(phi);
        let z = displacedRadius * Math.sin(phi) * Math.sin(theta);

        // Rotate around Y-axis (with fixed tilt offset)
        const cosY = Math.cos(this.angleY + 0.5);
        const sinY = Math.sin(this.angleY + 0.5);
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
          // Lambertian shading from surface normal
          const len = Math.hypot(x, y, z);
          const nx = x / len;
          const ny = y / len;
          const nz = z / len;
          const diffuse = Math.max(0, nx * lx + ny * ly + nz * lz);
          const raw = this.AMBIENT + (1 - this.AMBIENT) * diffuse;
          const intensity = Math.min(
            1,
            Math.pow(raw * this.BRIGHTNESS, this.SHADE_GAMMA),
          );

          // Select character based on lighting
          const shadeIndex = Math.max(
            0,
            Math.min(
              this.SHADING.length - 1,
              Math.floor(intensity * (this.SHADING.length - 1)),
            ),
          );
          const char = this.SHADING[shadeIndex];

          // Color based on elevation: blue for ocean, green for land
          // Quantize into 8 color steps to use CSS classes (bypasses Angular encapsulation)
          const isOcean = normalizedElevation < SEA_LEVEL;
          let colorIndex: number;

          if (isOcean) {
            // 4 ocean shades: deep blue → shallow cyan-blue
            const depth = (SEA_LEVEL - normalizedElevation) / SEA_LEVEL;
            colorIndex = Math.min(3, Math.floor(depth * 4));
          } else {
            // 4 land shades: lowland → highland green
            const height = (normalizedElevation - SEA_LEVEL) / (1 - SEA_LEVEL);
            colorIndex = 4 + Math.min(3, Math.floor(height * 4));
          }

          const cls = `orb-c${colorIndex}`;
          const span = `<span class="${cls}">${char}</span>`;

          // Only write if this point is closer than what's already buffered
          if (z > zBuffer[yp][xp]) {
            zBuffer[yp][xp] = z;
            outputBuffer[yp][xp] = span;
          }
        }
      }
    }
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

    // Fixed vertical frame: always output the same rows around the buffer center,
    // regardless of rotation, so the container height is stable.
    const centerRow = Math.floor(rows / 2);
    const fixedRadius = Math.ceil(this.RADIUS * 1.3);
    const topRow = Math.max(0, centerRow - fixedRadius);
    const bottomRow = Math.min(rows - 1, centerRow + fixedRadius);

    // Slice each row to the equator width (preserves projected positions)
    let result = "";
    for (let r = topRow; r <= bottomRow; r++) {
      result +=
        outputBuffer[r].slice(equatorLeft, equatorRight + 1).join("") + "\n";
    }
    return result;
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
