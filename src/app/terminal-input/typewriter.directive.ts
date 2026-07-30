import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  afterNextRender,
} from "@angular/core";

/**
 * TypewriterDirective - Types out text content character by character.
 * Works directly with DOM text nodes, preserving all HTML structure.
 *
 * Usage:
 *   <div [typewriter]="true" [typeSpeed]="50" (typewriterComplete)="onDone()">
 *     <p>Hello <strong>World</strong></p>
 *   </div>
 */
@Directive({
  selector: "[typewriter]",
  standalone: true,
})
export class TypewriterDirective implements OnDestroy, OnChanges {
  /** Enable/disable the typewriter effect */
  @Input() typewriter: boolean = true;
  /** Milliseconds per character (default: 40) */
  @Input() typeSpeed: number = 40;
  /** Delay in milliseconds before starting (default: 0ms) */
  @Input() typeDelay: number = 0;

  /** Emitted when typewriter animation completes */
  @Output() typewriterComplete = new EventEmitter<void>();

  private el: HTMLElement;
  private animationTimeout: any = null;
  private isAnimating = false;

  constructor(private ref: ElementRef<HTMLElement>) {
    this.el = this.ref.nativeElement;

    // Wait for Angular to fully render the DOM before starting
    afterNextRender(() => {
      if (this.typewriter) {
        this.startTypewriter();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["typewriter"] && changes["typewriter"].currentValue === true) {
      this.stopTypewriter();
      setTimeout(() => this.startTypewriter(), 50);
    }
  }

  ngOnDestroy(): void {
    this.stopTypewriter();
  }

  private startTypewriter(): void {
    if (this.isAnimating) return;

    // Wait for any pending Angular rendering
    setTimeout(() => {
      // Collect all text nodes in document order
      const textNodes = this.collectTextNodes(this.el);

      if (textNodes.length === 0) return;

      this.isAnimating = true;

      // Make visible and clear text nodes
      this.el.classList.remove("typewriter-hidden");

      // Store original text and clear each text node
      const originalTexts: string[] = [];
      for (const node of textNodes) {
        originalTexts.push(node.textContent || "");
        node.textContent = "";
      }

      let nodeIndex = 0;
      let charIndex = 0;
      let lastTypeTime = 0;

      const typeNext = (timestamp: number) => {
        if (nodeIndex >= textNodes.length) {
          this.isAnimating = false;
          this.typewriterComplete.emit();
          return;
        }

        // Type characters based on elapsed time
        while (timestamp - lastTypeTime >= this.typeSpeed) {
          const currentNode = textNodes[nodeIndex];
          const currentText = originalTexts[nodeIndex];
          if (charIndex < currentText.length) {
            currentNode.textContent += currentText[charIndex];
            charIndex++;
            lastTypeTime = timestamp;
          } else {
            nodeIndex++;
            charIndex = 0;
          }
          if (nodeIndex >= textNodes.length) break;
        }

        if (nodeIndex < textNodes.length) {
          this.animationTimeout = requestAnimationFrame(typeNext);
        } else {
          this.isAnimating = false;
          this.typewriterComplete.emit();
        }
      };

      this.animationTimeout = setTimeout(() => {
        lastTypeTime = performance.now();
        this.animationTimeout = requestAnimationFrame(typeNext);
      }, this.typeDelay);
    }, 100);
  }

  private collectTextNodes(element: Node): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip whitespace-only text nodes that are just formatting
        if (node.textContent?.trim() === "") {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let current = walker.nextNode();
    while (current) {
      textNodes.push(current as Text);
      current = walker.nextNode();
    }

    return textNodes;
  }

  private stopTypewriter(): void {
    if (this.animationTimeout !== null) {
      if (typeof this.animationTimeout === "number") {
        cancelAnimationFrame(this.animationTimeout);
      } else {
        clearTimeout(this.animationTimeout);
      }
      this.animationTimeout = null;
    }
    this.isAnimating = false;
  }
}
