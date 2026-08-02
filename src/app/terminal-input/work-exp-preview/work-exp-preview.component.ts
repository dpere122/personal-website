import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TypewriterDirective } from "../typewriter.directive";

export type WorkExpMode = "preview" | "final";

@Component({
  selector: "app-work-exp-preview",
  templateUrl: "./work-exp-preview.component.html",
  styleUrls: ["./work-exp-preview.component.css"],
  standalone: true,
  imports: [CommonModule, TypewriterDirective],
})
export class WorkExpPreviewComponent {
  /** Work experience items to display */
  @Input() experiences?: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
  }>;

  /** Typing speed in ms per character (final mode) */
  @Input() typeSpeed: number = 30;

  /** Typing speed for preview mode (slower by default) */
  @Input() previewTypeSpeed: number = 60;

  /** Mode: "preview" (AI-stream style with header) or "final" (plain output) */
  @Input() mode: WorkExpMode = "final";

  /** Emitted when preview typewriter animation completes */
  @Output() typewriterComplete = new EventEmitter<void>();
}
