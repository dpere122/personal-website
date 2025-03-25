import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubRepo } from '../models/github-repo.model';

@Component({
  selector: 'app-modern-file-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-file-manager.component.html',
  styleUrls: ['./modern-file-manager.component.css']
})
export class ModernFileManagerComponent implements OnInit {
  currentPath: string = 'GitHub';
  pathSegments: string[] = [];
  
  // First HashMap: String to GithubRepo
  repoMap = new Map<string, GithubRepo>();
  
  // Second HashMap (to be used later): String to Object
  dataMap = new Map<string, any>();
  
  // Lists derived from the hashmaps for display
  repoList: string[] = [];
  selectedRepo: GithubRepo | null = null;
  
  // Track selected items
  selectedKey: string = '';
  
  ngOnInit() {
    this.initializeRepos();
    this.repoList = Array.from(this.repoMap.keys());
    this.pathSegments = this.currentPath.split('/');
  }
  
  initializeRepos() {
    // Populate the repository map
    this.repoMap.set('personal-website', new GithubRepo(
      'personal-website',
      'A responsive portfolio website built with Angular and Bootstrap 5',
      'https://github.com/username/personal-website',
      'assets/images/projects/website.jpg'
    ));
    
    this.repoMap.set('data-analyzer', new GithubRepo(
      'data-analyzer',
      'Data analysis tool built with Python and Pandas',
      'https://github.com/username/data-analyzer',
      'assets/images/projects/data.jpg'
    ));
    
    this.repoMap.set('task-manager', new GithubRepo(
      'task-manager',
      'Task management application with React and Node.js',
      'https://github.com/username/task-manager',
      'assets/images/projects/tasks.jpg'
    ));
    
    this.repoMap.set('e-commerce-api', new GithubRepo(
      'e-commerce-api',
      'RESTful API for e-commerce applications using Express and MongoDB',
      'https://github.com/username/e-commerce-api',
      'assets/images/projects/api.jpg'
    ));
    
    this.repoMap.set('machine-learning', new GithubRepo(
      'machine-learning',
      'Collection of machine learning models and algorithms',
      'https://github.com/username/machine-learning',
      'assets/images/projects/ml.jpg'
    ));
  }
  
  selectRepo(key: string) {
    this.selectedKey = key;
    this.selectedRepo = this.repoMap.get(key) || null;
    this.updatePath(key);
  }
  
  updatePath(key: string) {
    this.currentPath = `GitHub/${key}`;
    this.pathSegments = this.currentPath.split('/');
  }
  
  navigateTo(path: string) {
    this.currentPath = path;
    this.pathSegments = this.currentPath.split('/');
    
    const segments = path.split('/');
    if (segments.length > 1) {
      const repoKey = segments[1];
      this.selectRepo(repoKey);
    } else {
      this.selectedRepo = null;
      this.selectedKey = '';
    }
  }

  getFileIcon(item: { type: string; name: string }): string {
    if (item.type === 'folder') {
      return '📁';
    }
    const extension = item.name.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'png':
      case 'gif': return '🖼️';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📽️';
      case 'txt': return '📄';
      default: return '📄';
    }
  }
}
