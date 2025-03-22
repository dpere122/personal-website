import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, AfterViewInit {
  pages: string[] = ["Home","Portfolio","Blog","Resume"];
  bannerOpacity: number = 1;
  originalHeight: number = 100; // Default banner height in pixels
  minHeight: number = 60; // Minimum height (60% of original)
  originalTitleSize: number = 2.7; // Default title size in em
  minTitleSize: number = 2; // Minimum title size (target when scrolled)
  currentRoute: string = '';
  isNavbarCollapsed: boolean = false;

  constructor(private router: Router){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.isNavbarCollapsed = false; // Close navbar when navigating
      }
    });
  }
  
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  
  isActive(page: string): boolean {
    const pageLower = page.toLowerCase();
    if (pageLower === 'home') {
      return this.currentRoute === '/';
    }
    return this.currentRoute === `/${pageLower}`;
  }
  
  ngAfterViewInit(): void {
    // Set initial height if needed
    const banner = document.querySelector('.banner') as HTMLElement;
    if (banner) {
      this.originalHeight = banner.offsetHeight;
      this.minHeight = this.originalHeight * 0.8; // 80% of original height
    }
  }
  
  ngOnInit(): void {
  }

  navigateToPage(page: string) {
    switch(page.toLowerCase()) {
      case 'home':
        this.router.navigate(['/']);
        break;
      case 'blog':
        this.router.navigate(['/blog']);
        break;
      // Add other navigation cases as needed
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Get viewport width, height and scroll position
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    // Calculate how far down the user has scrolled (as a percentage)
    // The transition will complete at 1/4 of the viewport height
    const scrollPercentage = Math.min(scrollPosition / (windowHeight * 0.25), 1);
    
    // Calculate opacity: starts at 1 (100%) and goes down to 0.7 (70%)
    this.bannerOpacity = 1 - (0.3 * scrollPercentage);
    
    // Calculate height: starts at original height and goes down to minimum height
    const currentHeight = this.originalHeight - ((this.originalHeight - this.minHeight) * scrollPercentage);
    
    // Apply the opacity and height to the navbar element
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar) {
      navbar.style.opacity = this.bannerOpacity.toString();
      navbar.style.height = `${currentHeight}px`;
    }
    
    // Only resize title on desktop (screen width > 991px)
    if (windowWidth > 991) {
      // Calculate title size: starts at original size and goes down to minimum size
      const currentTitleSize = this.originalTitleSize - ((this.originalTitleSize - this.minTitleSize) * scrollPercentage);
      
      // Apply the font size to the title element
      const title = document.querySelector('.title') as HTMLElement;
      if (title) {
        title.style.fontSize = `${currentTitleSize}em`;
      }
    }
  }
}
