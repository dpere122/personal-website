import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBoxComponent } from '../custom-box/custom-box.component';
import { PortfolioBoxComponent } from '../portfolio-box/portfolio-box.component';
import { GitWidgetComponent } from '../git-widget/git-widget.component';
import { ModernFileManagerComponent } from '../modern-file-manager/modern-file-manager.component';

@Component({
  selector: 'app-host-page',
  templateUrl: './host-page.component.html',
  styleUrls: ['./host-page.component.css'],
  imports: [
    CommonModule, 
    CustomBoxComponent, 
    PortfolioBoxComponent, 
    GitWidgetComponent,
    ModernFileManagerComponent
  ],
  standalone: true
})
export class HostPageComponent {

}
