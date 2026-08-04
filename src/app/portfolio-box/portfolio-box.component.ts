import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { GithubService, PaginatedResult } from "../services/github.service";
import { GithubRepo } from "../models/github-repo.model";

@Component({
  selector: "app-portfolio-box",
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./portfolio-box.component.html",
  styleUrls: ["./portfolio-box.component.css"],
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

  constructor(private githubService: GithubService) {}

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
