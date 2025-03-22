import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalInputComponent } from '../terminal-input/terminal-input.component';

@Component({
  selector: 'app-custom-box',
  standalone: true,
  imports: [CommonModule, TerminalInputComponent],
  templateUrl: './custom-box.component.html',
  styleUrls: ['./custom-box.component.css']
})
export class CustomBoxComponent {

}
