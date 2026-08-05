import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { trigger, transition, animate, style } from "@angular/animations";
import { GithubService, PaginatedResult } from "../services/github.service";
import { GithubRepo } from "../models/github-repo.model";

@Component({
  selector: "app-portfolio-box",
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./portfolio-box.component.html",
  styleUrls: ["./portfolio-box.component.css"],
  animations: [
    trigger("pageTransition", [
      transition("* => *", [
        style({ opacity: 0 }),
        animate("0.3s ease-in-out", style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PortfolioBoxComponent implements OnInit {
  @Input() title: string = "Public Repositories";

  repos: GithubRepo[] = [];
  loading = true;
  error: string | null = null;

  // Pagination state
  currentPage = 1;
  totalPages = 0;
  totalCount = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  private readonly MAX_REPOS_PER_PAGE = 5;

  constructor(private githubService: GithubService) {}

  /**
   * Returns an array of placeholder indices so the template can render
   * "Coming Soon" cards when there are fewer than MAX_REPOS_PER_PAGE repos.
   */
  get placeholders(): number[] {
    const count = this.MAX_REPOS_PER_PAGE - this.repos.length;
    return count > 0 ? Array.from({ length: count }, (_, i) => i) : [];
  }

  ngOnInit() {
    this.loadRepos();
  }

  private loadRepos(page: number = this.currentPage) {
    this.loading = true;
    this.githubService.getPublicReposPaginated(page).subscribe({
      next: (result: PaginatedResult<GithubRepo>) => {
        this.repos = result.items;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;
        this.hasNextPage = result.hasNextPage;
        this.hasPreviousPage = result.hasPreviousPage;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load repositories.";
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadPreviousPage() {
    if (this.hasPreviousPage) {
      this.loadRepos(this.currentPage - 1);
    }
  }

  loadNextPage() {
    if (this.hasNextPage) {
      this.loadRepos(this.currentPage + 1);
    }
  }
}
