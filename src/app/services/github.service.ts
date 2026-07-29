import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GithubRepo } from "../models/github-repo.model";

@Injectable({
  providedIn: "root",
})
export class GithubService {
  private readonly GITHUB_API = "https://api.github.com";
  private readonly USERNAME = "dpere122";

  constructor(private http: HttpClient) {}

  /**
   * Fetch all public repositories for the configured GitHub user.
   * Maps the raw GitHub response to `GithubRepo` instances.
   */
  getPublicRepos(): Observable<GithubRepo[]> {
    const url = `${this.GITHUB_API}/users/${this.USERNAME}/repos?per_page=100`;

    return this.http
      .get<any[]>(url)
      .pipe(
        map((repos) =>
          repos.map(
            (repo) =>
              new GithubRepo(repo.name, repo.description || "", repo.html_url),
          ),
        ),
      );
  }
}
