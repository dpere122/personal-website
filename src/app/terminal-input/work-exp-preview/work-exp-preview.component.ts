import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TypewriterDirective } from "../typewriter.directive";
import { Experience } from "../terminal-input.component";

export type WorkExpMode = "preview" | "final";

@Component({
  selector: "app-work-exp-preview",
  templateUrl: "./work-exp-preview.component.html",
  styleUrls: ["./work-exp-preview.component.css"],
  standalone: true,
  imports: [CommonModule, TypewriterDirective],
})
export class WorkExpPreviewComponent implements AfterViewInit, OnChanges {
  /** Work experience items to display */
  @Input() experiences?: Experience[];

  /** Typing speed in ms per character (final mode) */
  @Input() typeSpeed: number = 30;

  /** Typing speed for preview mode (slower by default) */
  @Input() previewTypeSpeed: number = 60;

  /** Mode: "preview" (AI-stream style with header) or "final" (plain output) */
  @Input() mode: WorkExpMode = "final";

  /** Whether the preview box is currently fading out */
  @Input() previewFadingOut = false;

  /** Emitted when preview typewriter animation completes */
  @Output() typewriterComplete = new EventEmitter<void>();

  @ViewChild("workExpBox") workExpBoxRef!: ElementRef<HTMLDivElement>;
  @ViewChild("workExpOutput") workExpOutputRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.setupResizeListener();
    // Initial measurement in case content is already visible
    setTimeout(() => this.adjustBoxHeight(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["mode"] && changes["mode"].currentValue === "final") {
      setTimeout(() => this.adjustBoxHeight(), 0);
    }
  }

  @HostListener("window:resize")
  onResize(): void {
    this.adjustBoxHeight();
  }

  onFinalTypewriterComplete(): void {
    // Ensure box height matches after typing finishes
    setTimeout(() => this.adjustBoxHeight(), 0);
  }

  private adjustBoxHeight(): void {
    const box = this.workExpBoxRef?.nativeElement;
    const output = this.workExpOutputRef?.nativeElement;
    if (!box || !output) return;

    const header = box.querySelector(".work-exp-header") as HTMLElement;
    const headerHeight = header ? header.offsetHeight : 0;
    const scrollablePadding = this.getPaddingHeight(
      box.querySelector(".work-exp-scrollable") as HTMLElement,
    );

    // Measure the actual content height
    const contentHeight = output.scrollHeight;

    // Set box height to fit all content
    box.style.height = `${headerHeight + contentHeight + scrollablePadding}px`;
  }

  private getPaddingHeight(el: HTMLElement | null): number {
    if (!el) return 0;
    const style = window.getComputedStyle(el);
    return (
      parseFloat(style.paddingTop || "0") +
      parseFloat(style.paddingBottom || "0")
    );
  }

  private setupResizeListener(): void {
    // Using HostListener("window:resize") instead
  }
}
