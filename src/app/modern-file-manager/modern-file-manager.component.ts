import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubRepo } from '../models/github-repo.model';
import { PdfDocument } from '../models/pdf-document.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modern-file-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-file-manager.component.html',
  styleUrls: ['./modern-file-manager.component.css']
})
export class ModernFileManagerComponent implements OnInit {
  // First column - Source directories
  sources = ['GitHub Repositories', 'PDF Documents'];
  selectedSource: string | null = null;
  
  // Second column - Items in the source
  // First HashMap: String to GithubRepo
  repoMap = new Map<string, GithubRepo>();
  // Second HashMap: String to PdfDocument
  pdfMap = new Map<string, PdfDocument>();
  
  // Contents of current view
  currentItems: string[] = [];
  selectedItem: string | null = null;
  
  // Third column - Details view
  selectedRepo: GithubRepo | null = null;
  selectedPdf: PdfDocument | null = null;
  
  // PDF viewer
  pdfUrl: SafeResourceUrl | null = null;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit() {
    this.initializeRepos();
    this.initializePdfs();
    
    // Select the first source by default
    if (this.sources.length > 0) {
      this.selectSource(this.sources[0]);
    }
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
  
  initializePdfs() {
    // Populate the PDF map with the Resume PDF from public_files
    this.pdfMap.set('Resume 2025.pdf', new PdfDocument(
      'Resume 2025.pdf',
      'assets/public_files/Resume 2025.pdf',
      'Professional Resume 2025',
      'John Doe',
      'Professional Resume',
      ['resume', 'professional', 'job application'],
      new Date('2023-12-15'),
      new Date('2024-03-22'),
      3,
      '196 KB'
    ));
    
    this.pdfMap.set('Project Proposal.pdf', new PdfDocument(
      'Project Proposal.pdf',
      'assets/public_files/Project Proposal.pdf',
      'Software Development Project Proposal',
      'Development Team',
      'Project Planning Document',
      ['project', 'proposal', 'software', 'development'],
      new Date('2023-10-05'),
      new Date('2023-11-10'),
      12,
      '450 KB'
    ));
    
    this.pdfMap.set('Technical Documentation.pdf', new PdfDocument(
      'Technical Documentation.pdf',
      'assets/public_files/Technical Documentation.pdf',
      'System Architecture Documentation',
      'Engineering Team',
      'Technical Reference',
      ['documentation', 'architecture', 'system', 'reference'],
      new Date('2023-08-12'),
      new Date('2024-01-15'),
      25,
      '3.2 MB'
    ));
  }
  
  selectSource(source: string) {
    this.selectedSource = source;
    this.selectedItem = null;
    this.selectedRepo = null;
    this.selectedPdf = null;
    this.pdfUrl = null;
    
    // Update the items for the selected source
    if (source === 'GitHub Repositories') {
      this.currentItems = Array.from(this.repoMap.keys());
    } else if (source === 'PDF Documents') {
      this.currentItems = Array.from(this.pdfMap.keys());
    } else {
      this.currentItems = [];
    }
  }
  
  selectItem(item: string) {
    this.selectedItem = item;
    
    // Clear previous selections
    this.selectedRepo = null;
    this.selectedPdf = null;
    this.pdfUrl = null;
    
    // Get the appropriate data based on current source
    if (this.selectedSource === 'GitHub Repositories') {
      this.selectedRepo = this.repoMap.get(item) || null;
    } else if (this.selectedSource === 'PDF Documents') {
      this.selectedPdf = this.pdfMap.get(item) || null;
      if (this.selectedPdf) {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedPdf.filePath);
      }
    }
  }
  
  getItemIcon(source: string, item: string): string {
    if (source === 'GitHub Repositories') {
      return '📁';
    } else if (source === 'PDF Documents') {
      return '📄';
    }
    return '📄';
  }
  
  getSourceIcon(source: string): string {
    if (source === 'GitHub Repositories') {
      return '📂';
    } else if (source === 'PDF Documents') {
      return '📚';
    }
    return '📁';
  }
}
