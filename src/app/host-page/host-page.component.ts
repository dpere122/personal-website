import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBoxComponent } from '../custom-box/custom-box.component';

@Component({
  selector: 'app-host-page',
  templateUrl: './host-page.component.html',
  styleUrls: ['./host-page.component.css'],
  imports: [CommonModule, CustomBoxComponent],
  standalone: true
})
export class HostPageComponent {

}
