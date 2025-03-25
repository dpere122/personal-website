import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-box.component.html',
  styleUrls: ['./portfolio-box.component.css']
})
export class PortfolioBoxComponent {
  @Input() title: string = 'Project Portfolio';
  @Input() projectName: string = 'Sample Project';
  @Input() projectUrl: string = 'https://github.com/username/project';
  @Input() description: string = 'A detailed description of the project goes here.';
}
