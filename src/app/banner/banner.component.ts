import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, AfterViewInit {
  pages:Array<String> = ["Home","Portfolio","Blog","Resume"];
  bannerOpacity: number = 1;
  originalHeight: number = 100; // Default banner height in pixels
  minHeight: number = 60; // Minimum height (60% of original)
  originalTitleSize: number = 2.5; // Default title size in em
  minTitleSize: number = 1.5; // Minimum title size (target when scrolled)

  constructor(){}
  
  ngAfterViewInit(): void {
    // Set initial height if needed
    const banner = document.querySelector('.banner') as HTMLElement;
    if (banner) {
      this.originalHeight = banner.offsetHeight;
      this.minHeight = this.originalHeight * 0.6; // 60% of original height
    }
  }
  
  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Get viewport height and scroll position
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    // Calculate how far down the user has scrolled (as a percentage)
    // The transition will complete at 1/4 of the viewport height
    const scrollPercentage = Math.min(scrollPosition / (windowHeight * 0.25), 1);
    
    // Calculate opacity: starts at 1 (100%) and goes down to 0.7 (70%)
    this.bannerOpacity = 1 - (0.3 * scrollPercentage);
    
    // Calculate height: starts at original height and goes down to 60% of original
    const currentHeight = this.originalHeight - ((this.originalHeight - this.minHeight) * scrollPercentage);
    
    // Calculate title size: starts at original size and goes down to minimum size
    const currentTitleSize = this.originalTitleSize - ((this.originalTitleSize - this.minTitleSize) * scrollPercentage);
    
    // Apply the opacity and height to the banner element
    const banner = document.querySelector('.banner') as HTMLElement;
    if (banner) {
      banner.style.opacity = this.bannerOpacity.toString();
      banner.style.height = `${currentHeight}px`;
    }
    
    // Apply the font size to the title element
    const title = document.querySelector('.title') as HTMLElement;
    if (title) {
      title.style.fontSize = `${currentTitleSize}em`;
    }
  }
}
