import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
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
export class TypewriterDirective
  implements OnDestroy, OnChanges, AfterViewInit
{
  /** Enable/disable the typewriter effect */
  @Input() typewriter: boolean = true;
  /** Milliseconds per character (default: 40) */
  @Input() typeSpeed: number = 40;
  /** Delay in milliseconds before starting (default: 0ms) */
  @Input() typeDelay: number = 0;

  /** Emitted when typewriter animation completes */
  @Output() typewriterComplete = new EventEmitter<void>();

  private el: HTMLElement;
  private animationTimeout: number | ReturnType<typeof setTimeout> | null =
    null;
  private isAnimating = false;
  private started = false;
  private completed = false;

  constructor(private ref: ElementRef<HTMLElement>) {
    this.el = this.ref.nativeElement;
  }

  ngAfterViewInit(): void {
    if (!this.started && this.typewriter) {
      this.started = true;
      this.startTypewriter();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["typewriter"] && changes["typewriter"].currentValue === true) {
      if (changes["typewriter"].previousValue === false) {
        this.stopTypewriter();
        this.started = true;
        setTimeout(() => this.startTypewriter(), 50);
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTypewriter();
  }

  private startTypewriter(): void {
    if (this.isAnimating) return;

    setTimeout(() => {
      const textNodes = this.collectTextNodes(this.el);

      if (textNodes.length === 0) return;

      this.isAnimating = true;

      this.el.classList.remove("typewriter-hidden");

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
          if (!this.completed) {
            this.completed = true;
            this.typewriterComplete.emit();
          }
          return;
        }

        while (timestamp - lastTypeTime >= this.typeSpeed) {
          const currentNode = textNodes[nodeIndex];
          const currentText = originalTexts[nodeIndex];
          const parent = currentNode.parentElement;
          const isToolPill = parent?.classList?.contains("tool-pill");

          if (isToolPill) {
            // Reveal full pill content instantly
            currentNode.textContent = currentText;
            parent?.classList.add("revealed");
            nodeIndex++;
            charIndex = 0;
          } else if (charIndex < currentText.length) {
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
          this.scrollToBottom();
          this.animationTimeout = requestAnimationFrame(typeNext);
        } else {
          this.scrollToBottom();
          this.isAnimating = false;
          if (!this.completed) {
            this.completed = true;
            this.typewriterComplete.emit();
          }
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

  private scrollToBottom(): void {
    // Walk up from this element to find the first ancestor with overflow-y:auto/scroll
    let node: HTMLElement | null = this.el.parentElement;
    while (node) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        node.scrollTop = node.scrollHeight;
        return;
      }
      node = node.parentElement;
    }

    // Fallback: scroll the element itself
    this.el.scrollTop = this.el.scrollHeight;
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
