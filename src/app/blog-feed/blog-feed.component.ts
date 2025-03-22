import {Component} from '@angular/core';
import { SIZE,BOXTYPE } from '../app.component';


@Component({
	selector: 'app-blog-feed',
	templateUrl: './blog-feed.component.html',
	styleUrls: ['./blog-feed.component.css']
})
export class BlogFeedComponent {
	SizeEnum = SIZE;
	BOXTYPE = BOXTYPE;
} 