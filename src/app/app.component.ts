import { Component } from '@angular/core';
import { MainBlockComponent } from './main-block/main-block.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'personal-website';
}
