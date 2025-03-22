import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';

/**
 * Terminal Input Component
 * 
 * This component simulates a classic terminal with auto-typing text and a blinking cursor.
 * It displays a series of messages that auto-type, pause, then erase, in a continuous cycle.
 * 
 * Features:
 * - Auto-typing text animation with configurable speed
 * - Blinking cursor that follows the text
 * - Configurable pause between messages
 * - Responsive height that can be controlled by parent component
 * - Terminal-like appearance with gradient background
 * - Optional height adjustment for scroll effects
 * 
 * Usage:
 * <app-terminal-input 
 *   [messages]="['Message 1', 'Message 2']"
 *   [typingSpeed]="50"
 *   [pauseBetweenMessages]="2000"
 *   [enableHeightChanges]="true">
 * </app-terminal-input>
 */
@Component({
  selector: 'app-terminal-input',
  templateUrl: './terminal-input.component.html',
  styleUrls: ['./terminal-input.component.css']
})
export class TerminalInputComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Default height of the terminal box in pixels */
  @Input() originalBoxHeight: number = 60;
  
  /** Minimum height the box can shrink to when scrolling */
  @Input() minBoxHeight: number = 30;
  
  /** Whether to enable height changes when parent component scrolls */
  @Input() enableHeightChanges: boolean = true;
  
  /** Array of messages to cycle through in the terminal */
  @Input() messages: string[] = [
    "Welcome to my personal website!",
    "I'm a Full Stack Developer",
    "Check out my portfolio",
    "View my latest projects",
    "Contact me for opportunities"
  ];
  
  /** Typing speed in milliseconds per character */
  @Input() typingSpeed: number = 50;
  
  /** Time to wait between finishing one message and starting to erase it (ms) */
  @Input() pauseBetweenMessages: number = 2000;

  /** Current text displayed in the terminal */
  terminalText: string = '';
  
  // Auto typing configuration
  /** Interval reference for the typing animation */
  typingInterval: any = null;
  
  /** Index of the current message being displayed */
  currentMessageIndex: number = 0;
  
  /** Index of the current character position in the message */
  currentCharIndex: number = 0;
  
  /** Whether we're currently erasing (true) or typing (false) */
  isErasing: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // No initialization needed
  }

  /**
   * After the view initializes, start the typing animation
   */
  ngAfterViewInit(): void {
    this.startTypingAnimation();
  }

  /**
   * Clean up any open intervals when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  /**
   * Starts the auto-typing animation by setting up an interval
   * that calls typeText() at the configured typing speed
   */
  startTypingAnimation(): void {
    this.typingInterval = setInterval(() => this.typeText(), this.typingSpeed);
  }
  
  /**
   * Core typing animation function
   * Handles both typing (adding characters) and erasing (removing characters)
   * as well as pausing between messages and cycling through the message array
   */
  typeText(): void {
    const currentMessage = this.messages[this.currentMessageIndex];
    
    if (!this.isErasing) {
      // TYPING FORWARD
      if (this.currentCharIndex < currentMessage.length) {
        // Still have characters to add
        this.terminalText = currentMessage.slice(0, this.currentCharIndex + 1);
        this.currentCharIndex++;
      } else {
        // Reached the end of the message
        this.isErasing = true;
        clearInterval(this.typingInterval);
        
        // Pause before starting to erase
        setTimeout(() => {
          // Erase faster than typing for better effect
          this.typingInterval = setInterval(() => this.typeText(), this.typingSpeed / 2);
        }, this.pauseBetweenMessages);
      }
    } else {
      // ERASING
      if (this.currentCharIndex > 0) {
        // Still have characters to erase
        this.terminalText = currentMessage.slice(0, this.currentCharIndex - 1);
        this.currentCharIndex--;
      } else {
        // Fully erased, move to next message
        this.isErasing = false;
        // Move to next message (loop back to start if at the end)
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
        clearInterval(this.typingInterval);
        
        // Small pause before starting the next message
        setTimeout(() => {
          this.typingInterval = setInterval(() => this.typeText(), this.typingSpeed);
        }, 500);
      }
    }
  }

  /**
   * Updates the height of the gradient box
   * This method is called by the parent component during scroll events
   * If enableHeightChanges is false, this method will do nothing.
   * 
   * @param height - The new height in pixels
   */
  updateBoxHeight(height: number): void {
    if (!this.enableHeightChanges) return;
    
    const gradientBox = document.querySelector('.gradient-box') as HTMLElement;
    if (gradientBox) {
      gradientBox.style.height = `${height}px`;
    }
  }
}
