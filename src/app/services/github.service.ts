import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { GithubRepo } from "../models/github-repo.model";

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: "root",
})
export class GithubService {
  private readonly GITHUB_API = "https://api.github.com";
  private readonly USERNAME = "dpere122";
  private readonly PER_PAGE = 5;

  constructor(private http: HttpClient) {}

  /**
   * Fetch a single page of public repositories with pagination metadata.
   * Uses the user profile endpoint for total count (CORS-safe).
   * @param page - 1-based page number
   */
  getPublicReposPaginated(
    page: number = 1,
  ): Observable<PaginatedResult<GithubRepo>> {
    const reposUrl = `${this.GITHUB_API}/users/${this.USERNAME}/repos?per_page=${this.PER_PAGE}&page=${page}`;
    const userUrl = `${this.GITHUB_API}/users/${this.USERNAME}`;

    return this.http.get<any>(userUrl).pipe(
      map((user) => user.public_repos || 0),
      switchMap((totalCount) =>
        this.http.get<any[]>(reposUrl, { observe: "response" }).pipe(
          map((response: HttpResponse<any[]>) => {
            const totalPages = Math.ceil(totalCount / this.PER_PAGE);

            return {
              items: response.body!.map(
                (repo) =>
                  new GithubRepo(
                    repo.name,
                    repo.description || "",
                    repo.html_url,
                  ),
              ),
              currentPage: page,
              totalPages,
              totalCount,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1,
            };
          }),
        ),
      ),
    );
  }
}
