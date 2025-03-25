import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubRepo } from '../models/github-repo.model';

@Component({
  selector: 'app-git-widget',
  templateUrl: './git-widget.component.html',
  styleUrls: ['./git-widget.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class GitWidgetComponent {
  githubRepos: GithubRepo[] = [
    new GithubRepo(
      'personal-website',
      'My personal portfolio website',
      'https://github.com/username/personal-website'
    ),
    // Add more repos as needed
  ];

  currentRepo: GithubRepo | null = null;

  selectRepo(repo: GithubRepo) {
    this.currentRepo = repo;
  }
}
