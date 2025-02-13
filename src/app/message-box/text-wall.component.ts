import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, resolveForwardRef, ComponentRef, ElementRef, Renderer2 } from '@angular/core';
import { SIZE, BOXTYPE } from '../app.component';
import { ModelBlockComponent } from '../3DModel/model-block.component';
import { GitWidgetComponent } from '../git-widget/git-widget.component';

@Component({
  selector: 'app-text-wall',
  templateUrl: './text-wall.component.html',
  styleUrls: ['./text-wall.component.css']
})
export class TextWallComponent implements OnInit, AfterViewInit {

  @ViewChild('dynamicBlock', { read: ViewContainerRef })
  dynamicBlock!: ViewContainerRef;

  @ViewChild('dynamicBlock')
  el!: ElementRef;

  @Input() titleText: string = "title-text";
  @Input() boxType: BOXTYPE = BOXTYPE.RESPONSE
  @Input() contentTemplate: any = "";
  @Input() textScale: SIZE = SIZE.small;
  @Input() addModel: boolean = false;
  @Input() addGitWidget: boolean = false;
  @Input() cutoff: number = 0;
  textContent: string = "";
  textSize: string = "";
  @Input() modelSize: string = "col-7";
  @Input() modelURL: string = "../assets/models/toy_boat/scene.gltf";
  @Input() modelScale: number = 0.4;
  @Input() modelVerticalOffset: number = 20;




  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    var textVariable: number = 5;

    switch (this.textScale) {
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
    console.log(this.boxType)
    if (this.cutoff > 0) {
      this.textSize += "col-" + (textVariable - this.cutoff);
    } else {
      this.textSize += "col-" + textVariable;
    }


  }

  ngAfterViewInit() {
    if (this.addModel) {
      const childComponentFactory = resolveForwardRef(ModelBlockComponent);
      const componentRef: ComponentRef<ModelBlockComponent> = this.dynamicBlock.createComponent(childComponentFactory);
      componentRef.setInput("modelURL", this.modelURL);
      componentRef.setInput("scale", this.modelScale);
      componentRef.setInput("verticalOffset", this.modelVerticalOffset);


      const modelContainer: HTMLElement = componentRef.location.nativeElement;
      this.renderer.appendChild(this.el.nativeElement, modelContainer);

      this.renderer.addClass(this.el.nativeElement, this.modelSize);
    } else if (this.addGitWidget) {
      const childComponentFactory = resolveForwardRef(GitWidgetComponent);
      const componentRef: ComponentRef<GitWidgetComponent> = this.dynamicBlock.createComponent(childComponentFactory);
    }
  }

  // setBoxType() {
  //   switch (this.boxType) {
  //     case BOXTYPE.RESPONSE:
  //       if(){

  //       }
  //       break;
  //     case BOXTYPE.MESSAGE:
  //       break;
  //     case BOXTYPE.NOTICE:
  //       break;
  //     case BOXTYPE.WARNING:
  //       break;
  //     default:
  //       break;

  //   }
  // }
}
