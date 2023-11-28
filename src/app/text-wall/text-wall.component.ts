import { Component, Input, OnInit,AfterViewInit, ViewChild, ViewContainerRef, resolveForwardRef, ComponentRef,ElementRef, Renderer2} from '@angular/core';
import { SIZE } from '../app.component';
import { ModelBlockComponent } from '../model-block/model-block.component';

@Component({
  selector: 'app-text-wall',
  templateUrl: './text-wall.component.html',
  styleUrls: ['./text-wall.component.css']
})
export class TextWallComponent implements OnInit, AfterViewInit{

	@ViewChild('dynamicBlock', { read: ViewContainerRef })
	dynamicBlock!: ViewContainerRef;

	
	@ViewChild('dynamicBlock')
	el!: ElementRef;


	@Input() textScale:SIZE = SIZE.small;
	@Input() addModel:boolean  = false;
	textSize:String = "";
	modelSize:String = "";
	constructor(private renderer:Renderer2){

	}

	ngOnInit(){
		// initialize size of container
		switch (this.textScale){
			case SIZE.small:
				this.textSize = "col-3";
				this.modelSize = "col-9";
				break;
			case SIZE.medium:
				this.textSize = "col-6";
				this.modelSize = "col-6";
				break;
			case SIZE.large:
				this.textSize = "col-9";
				this.modelSize = "col-3";
				break;
		}
	}

	ngAfterViewInit(){
		const childComponentFactory = resolveForwardRef(ModelBlockComponent);
		const componentRef:ComponentRef<ModelBlockComponent> = this.dynamicBlock.createComponent(childComponentFactory);

		const modelContainer:HTMLElement = componentRef.location.nativeElement;
		this.renderer.appendChild(this.el.nativeElement,modelContainer);

	}
}
