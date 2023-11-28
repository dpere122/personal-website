import {Component} from '@angular/core';
import { SIZE } from '../app.component';


@Component({
	selector: 'app-main-block',
	templateUrl: './main-block.component.html',
	styleUrls: ['./main-block.component.css']
})
export class MainBlockComponent {
	SizeEnum = SIZE;

}

