import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { GithubService } from "../services/github.service";
import { GithubRepo } from "../models/github-repo.model";

@Component({
  selector: "app-portfolio-box",
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./portfolio-box.component.html",
  styleUrls: ["./portfolio-box.component.css"],
})
export class PortfolioBoxComponent implements OnInit, OnDestroy {
  @Input() title: string = "Project Portfolio";

  repos: GithubRepo[] = [];
  loading = true;
  error: string | null = null;

  currentFrameIndex = 0;
  private animationTimer: any = null;
  private readonly frameDuration = 180;

  readonly defaultOrbAnimation: string[] = [
    // Frame 1 — highlight left
    `         .       
       .-=#%#=-.    
     -=#%@@@@%#=.-  
    =#%@@@@@@@@%#= 
   =#%@*********@%#=
   %#%@*********@%#=
   %#%@@@@@@@@@@%#= 
    =#%@@@@@@@@%#= 
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 2 — highlight upper-left
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@@@@@@@@%#= 
   =#%@*********@%#=
   %#%@@@@@@@@@@%#= 
   %#%@@@@@@@@@@%#= 
    =#%@@@@@@@@%#= 
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 3 — highlight top
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@********@%#=
   =#%@*********@%#=
   %#%@@@@@@@@@@%#= 
   %#%@@@@@@@@@@%#= 
    =#%@@@@@@@@%#= 
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 4 — highlight upper-right
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@@@@@@@@%#= 
   =#%@*********@%#=
   %#%@*********@%#=
   %#%@@@@@@@@@@%#= 
    =#%@@@@@@@@%#= 
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 5 — highlight right
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@@@@@@@@%#= 
   =#%@@@@@@@@@@%#=
   %#%@*********@%#=
   %#%@*********@%#=
    =#%@@@@@@@@%#= 
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 6 — highlight lower-right
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@@@@@@@@%#= 
   =#%@@@@@@@@@@%#=
   %#%@@@@@@@@@@%#= 
   %#%@*********@%#=
    =#%@********@%#=
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 7 — highlight bottom
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@@@@@@@@%#= 
   =#%@@@@@@@@@@%#=
   %#%@@@@@@@@@@%#= 
   %#%@@@@@@@@@@%#= 
    =#%@********@%#=
     -=#%@@@@@%#=.-  
       .-=#%#=-.    
         .       `,
    // Frame 8 — highlight lower-left
    `         .       
       .-=#%#=-.    
     -=#%@@@@@%#=.- 
    =#%@@@@@@@@%#= 
   =#%@*********@%#=
   %#%@*********@%#=
   %#%@@@@@@@@@@%#= 
    =#%@@@@@@@@%#= 
     -=#%@@@@%#=.-  
       .-=#%#=-.    
         .       `,
  ];

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.startAnimation();
    this.loadRepos();
  }

  ngOnDestroy() {
    this.stopAnimation();
  }

  private loadRepos() {
    this.githubService.getPublicRepos().subscribe({
      next: (repos) => {
        this.repos = repos;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load repositories.";
        this.loading = false;
        console.error(err);
      },
    });
  }

  private startAnimation() {
    this.animationTimer = setInterval(() => {
      this.currentFrameIndex =
        (this.currentFrameIndex + 1) % this.defaultOrbAnimation.length;
    }, this.frameDuration);
  }

  private stopAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }
}
