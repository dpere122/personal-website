import { Component } from '@angular/core';

export enum SIZE{
	small,
	medium,
	large
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'personal-website';
}

