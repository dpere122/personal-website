import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnInit, Renderer2, resolveForwardRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ModelBlockComponent } from '../3DModel/model-block.component';
import { SIZE } from '../app.component';

@Component({
  selector: 'app-response-box',
  templateUrl: './response-box.component.html',
  styleUrls: ['./response-box.component.css']
})
export class ResponseBoxComponent implements OnInit, AfterViewInit{
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
  @Input() modelSize:string = "col-7";
  @Input() modelURL:string = "../assets/models/toy_boat/scene.gltf";
  @Input() modelScale:number = 0.4;
  @Input() modelVerticalOffset:number = 20;

  
  

  constructor(private renderer:Renderer2){}

  ngOnInit(){
    var textVariable:number = 5;

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
    }else{
      this.textSize += "col-"+textVariable;
    }


  }

  ngAfterViewInit(){
    if(this.addModel){
      const childComponentFactory = resolveForwardRef(ModelBlockComponent);
      const componentRef:ComponentRef<ModelBlockComponent> = this.dynamicBlock.createComponent(childComponentFactory);
      componentRef.setInput("modelURL",this.modelURL);
      componentRef.setInput("scale",this.modelScale);
      componentRef.setInput("verticalOffset",this.modelVerticalOffset);

  
      const modelContainer:HTMLElement = componentRef.location.nativeElement;
      this.renderer.appendChild(this.el.nativeElement,modelContainer);

      this.renderer.addClass(this.el.nativeElement,this.modelSize);
    }
  }
}