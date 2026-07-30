import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
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
 * Renders a rotating ASCII Earth sphere using canvas (GPU-composited).
 * - Parametric sphere points (θ, φ → x, y, z)
 * - Rotation matrix around Y/X axes
 * - Perspective projection to 2D
 * - Lambertian shading from an upper-left-front light source
 * - Multi-octave noise + ridged mountain chains for terrain
 *
 * Optimizations:
 * - Canvas rendering (no DOM thrashing)
 * - requestAnimationFrame (pauses when tab hidden)
 * - Precomputed light vector, rotation trig, frame bounds
 * - Reused buffers across frames
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
  @Input() originalBoxHeight: number = 60;
  @Input() minBoxHeight: number = 30;
  @Input() enableHeightChanges: boolean = true;
  @Input() frameDuration: number = 180;
  @Input() resumeData?: ResumeData;

  @ViewChild("orbCanvas", { read: ElementRef<HTMLCanvasElement> })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  // Animation state
  private rafId: number | null = null;
  private lastTime: number | null = null;

  // Sphere parameters
  private readonly RADIUS: number = 12;
  private readonly STEP: number = 0.008;
  private readonly FOV: number = 90;
  private readonly ORIGIN_X: number = 20;
  private readonly ORIGIN_Y: number = 12;
  private readonly HEIGHT_DISPLACEMENT: number = 2.0;
  private readonly CELL_ASPECT: number = 1.75;

  // Lighting (normalized once in ngOnInit)
  private readonly LIGHT_X: number = -0.15;
  private readonly LIGHT_Y: number = 0.1;
  private readonly LIGHT_Z: number = 0.35;
  private readonly AMBIENT: number = 0.15;
  private readonly BRIGHTNESS: number = 1.0;
  private readonly SHADE_GAMMA: number = 0.78;
  private readonly SHADING: string[] = ["░", "▒", "▓", "█"];
  private readonly SHADE_STEPS: number = this.SHADING.length - 1;
  private readonly NOISE_SEED: number = 115;
  private readonly MOUNTAIN_STRENGTH: number = 0.08;

  // Normalized light direction (computed in ngOnInit)
  private lx: number = 0;
  private ly: number = 0;
  private lz: number = 0;

  // Rotation angles
  private angleY: number = 0;
  private angleX: number = 0.41;

  // Precomputed frame geometry
  private rows: number = 0;
  private cols: number = 0;
  private centerRow: number = 0;
  private fixedRadius: number = 0;
  private topRow: number = 0;
  private bottomRow: number = 0;

  // Reused buffers
  private outputBuffer: string[][] = [];
  private zBuffer: number[][] = [];

  // Terrain colors matching CSS classes orb-c0..orb-c7
  private terrainColors: string[] = [
    "#1a4d91", // c0: deep ocean
    "#2e6bc4", // c1: deep ocean
    "#4d91f5", // c2: shallow ocean
    "#72b8ff", // c3: shallow ocean
    "#2e8b4a", // c4: lowland
    "#4dff9a", // c5: lowland
    "#82ffbd", // c6: highland
    "#b3ffb8", // c7: highland
  ];

  constructor() {}

  ngOnInit(): void {
    // Normalize light direction once
    const lightLen = Math.hypot(this.LIGHT_X, this.LIGHT_Y, this.LIGHT_Z);
    this.lx = this.LIGHT_X / lightLen;
    this.ly = this.LIGHT_Y / lightLen;
    this.lz = this.LIGHT_Z / lightLen;

    // Precompute frame geometry
    this.rows = this.ORIGIN_Y * 2 + 2;
    this.cols = this.ORIGIN_X * 2 + 2;
    this.centerRow = Math.floor(this.rows / 2);
    this.fixedRadius = Math.ceil(this.RADIUS * 1.3);
    this.topRow = Math.max(0, this.centerRow - this.fixedRadius);
    this.bottomRow = Math.min(this.rows - 1, this.centerRow + this.fixedRadius);

    // Allocate buffers once
    for (let r = 0; r < this.rows; r++) {
      this.outputBuffer[r] = [];
      this.zBuffer[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.outputBuffer[r][c] = " ";
        this.zBuffer[r][c] = -Infinity;
      }
    }
  }

  ngAfterViewInit(): void {
    this.startAnimation();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  private startAnimation(): void {
    this.lastTime = null;
    const tick = (time: number) => {
      if (this.lastTime === null) {
        this.lastTime = time;
      }
      const dt = time - this.lastTime;
      if (dt >= this.frameDuration) {
        this.lastTime = time;
        this.angleY += 0.24;
        this.angleX = 0.41;
        this.renderSphere();
        this.drawCanvas();
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopAnimation(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private hash(x: number, y: number, z: number): number {
    let n = x + y * 57 + z * 131 + this.NOISE_SEED;
    n = (n << 13) ^ n;
    return (
      1 -
      ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0
    );
  }

  private smooth(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

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

  private ridgedMountainNoise(theta: number, phi: number): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    const octaves = 3;
    const lacunarity = 2.0;
    const gain = 0.5;
    const ridgePower = 1.2;
    const thetaScale = 0.35;
    const phiScale = 1.0;

    for (let i = 0; i < octaves; i++) {
      const nx = theta * thetaScale * frequency;
      const ny = phi * phiScale * frequency;
      const nz = 0.5 + i * 0.1;
      const signal = 1 - Math.abs(this.noise3D(nx, ny, nz));
      const sharpened = Math.pow(signal, ridgePower);
      value += amplitude * sharpened;
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return value;
  }

  private latitudeBandWeight(phi: number): number {
    const lat = Math.PI / 2 - phi;
    const absLat = Math.abs(lat);
    const bandCenter = 0.7;
    const bandWidth = 0.55;
    const dist = absLat - bandCenter;
    return Math.exp(-0.5 * (dist / bandWidth) * (dist / bandWidth));
  }

  private renderSphere(): void {
    const SEA_LEVEL = 0.42;

    // Precompute rotation trig once per frame
    const cosY = Math.cos(this.angleY + 0.5);
    const sinY = Math.sin(this.angleY + 0.5);
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);

    // Reset buffers in-place
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.outputBuffer[r][c] = " ";
        this.zBuffer[r][c] = -Infinity;
      }
    }

    for (let theta = 0; theta < Math.PI * 2; theta += this.STEP) {
      for (let phi = 0.08; phi < Math.PI - 0.08; phi += this.STEP) {
        const noiseX = theta / Math.PI;
        const noiseY = phi / Math.PI;
        const baseElevation = this.fbm(noiseX, noiseY, 0.5);
        let normalizedElevation = (baseElevation + 0.5) * 0.8;

        const ridge = this.ridgedMountainNoise(theta, phi);
        const latWeight = this.latitudeBandWeight(phi);
        normalizedElevation += latWeight * ridge * this.MOUNTAIN_STRENGTH;
        normalizedElevation =
          normalizedElevation < 0
            ? 0
            : normalizedElevation > 1
              ? 1
              : normalizedElevation;

        const displacedRadius =
          this.RADIUS + (normalizedElevation - 0.5) * this.HEIGHT_DISPLACEMENT;

        let x = displacedRadius * Math.sin(phi) * Math.cos(theta);
        let y = displacedRadius * Math.cos(phi);
        let z = displacedRadius * Math.sin(phi) * Math.sin(theta);

        // Rotate Y
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        x = x1;
        z = z1;

        // Rotate X
        const y1 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y1;
        z = z2;

        if (z < 0) continue;

        const ooz = this.FOV / (this.FOV + z);
        const xp = Math.round(this.ORIGIN_X + ooz * x * this.CELL_ASPECT);
        const yp = Math.round(this.ORIGIN_Y - ooz * y);

        if (xp >= 0 && xp < this.cols && yp >= 0 && yp < this.rows) {
          const len = Math.sqrt(x * x + y * y + z * z);
          const nx = x / len;
          const ny = y / len;
          const nz = z / len;
          const diffuse = nx * this.lx + ny * this.ly + nz * this.lz;
          const raw =
            this.AMBIENT + (1 - this.AMBIENT) * (diffuse < 0 ? 0 : diffuse);
          const intensity =
            Math.pow(raw, this.SHADE_GAMMA) > 1
              ? 1
              : Math.pow(raw, this.SHADE_GAMMA);

          const shadeIndex =
            intensity * this.SHADE_STEPS > this.SHADE_STEPS
              ? this.SHADE_STEPS
              : Math.floor(intensity * this.SHADE_STEPS);
          const char = this.SHADING[shadeIndex];

          const isOcean = normalizedElevation < SEA_LEVEL;
          let colorIndex: number;

          if (isOcean) {
            const depth = (SEA_LEVEL - normalizedElevation) / SEA_LEVEL;
            colorIndex = depth * 4 > 3 ? 3 : Math.floor(depth * 4);
          } else {
            const height = (normalizedElevation - SEA_LEVEL) / (1 - SEA_LEVEL);
            colorIndex = 4 + (height * 4 > 3 ? 3 : Math.floor(height * 4));
          }

          const span = `<span style="color:${this.terrainColors[colorIndex]}">${char}</span>`;

          if (z > this.zBuffer[yp][xp]) {
            this.zBuffer[yp][xp] = z;
            this.outputBuffer[yp][xp] = span;
          }
        }
      }
    }
  }

  private drawCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 12;
    const lineHeight = 1.05 * fontSize;

    // Find widest row and equator bounds
    let widestCount = 0;
    let widestRow = 0;
    for (let r = 0; r < this.rows; r++) {
      let count = 0;
      for (let c = 0; c < this.cols; c++) {
        if (this.outputBuffer[r][c] !== " ") count++;
      }
      if (count > widestCount) {
        widestCount = count;
        widestRow = r;
      }
    }

    let equatorLeft = this.cols;
    let equatorRight = -1;
    for (let c = 0; c < this.cols; c++) {
      if (this.outputBuffer[widestRow][c] !== " ") {
        if (c < equatorLeft) equatorLeft = c;
        if (c > equatorRight) equatorRight = c;
      }
    }
    if (equatorRight < 0) return;

    const charWidth = fontSize * 0.6;
    const visibleRows = this.bottomRow - this.topRow + 1;
    const visibleCols = equatorRight - equatorLeft + 1;

    canvas.width = visibleCols * charWidth + 4;
    canvas.height = visibleRows * lineHeight + 4;

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px "Courier New", monospace`;
    ctx.textBaseline = "top";

    for (let r = this.topRow; r <= this.bottomRow; r++) {
      const y = (r - this.topRow) * lineHeight + 2;
      let x = 2;

      for (let c = equatorLeft; c <= equatorRight; c++) {
        const cell = this.outputBuffer[r][c];
        if (cell === " ") {
          x += charWidth;
          continue;
        }

        // Parse color and char from span
        const match = cell.match(/color:([^;]+)">(.)/);
        if (match) {
          ctx.fillStyle = match[1];
          ctx.fillText(match[2], x, y);
        }
        x += charWidth;
      }
    }
  }

  updateBoxHeight(height: number): void {
    if (!this.enableHeightChanges) return;
    const gradientBox = document.querySelector(".gradient-box") as HTMLElement;
    if (gradientBox) {
      gradientBox.style.height = `${height}px`;
    }
  }

  toggleExperience(exp: Experience): void {
    exp.expanded = !exp.expanded;
  }
}
