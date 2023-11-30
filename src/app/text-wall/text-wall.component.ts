import { Component, Input, OnInit,AfterViewInit, ViewChild, ViewContainerRef, resolveForwardRef, ComponentRef,ElementRef, Renderer2} from '@angular/core';
import { SIZE} from '../app.component';
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

	@Input() titleText:string = "title-text";
	@Input() contentTemplate:any = "";
	@Input() textScale:SIZE = SIZE.small;
	@Input() addModel:boolean  = false;
	@Input() cutoff:number = 0;
	textContent:string = "";
	textSize:string = "";
	modelSize:string = "";
	

	constructor(private renderer:Renderer2){}

	ngOnInit(){
		var textVariable:number = 5;
		const maxSize:number = 12;

		switch (this.textScale){
			case SIZE.small:
				textVariable = 5;
				break;
			case SIZE.medium:
				textVariable = 7;
				break;
			case SIZE.large:
				textVariable = 9;
				break;
		}
		if(this.cutoff > 0){
			this.textSize += "col-"+(textVariable-this.cutoff);
			this.modelSize += "col-"+(maxSize-textVariable);
		}else{
			this.textSize += "col-"+textVariable;
			this.modelSize += "col-"+(maxSize-textVariable);
		}

	}

	ngAfterViewInit(){
		if(this.addModel){
			const childComponentFactory = resolveForwardRef(ModelBlockComponent);
			const componentRef:ComponentRef<ModelBlockComponent> = this.dynamicBlock.createComponent(childComponentFactory);
	
			const modelContainer:HTMLElement = componentRef.location.nativeElement;
			this.renderer.appendChild(this.el.nativeElement,modelContainer);

			this.renderer.addClass(this.el.nativeElement,this.modelSize);
		}
	}
}
