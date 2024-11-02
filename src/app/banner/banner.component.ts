import { Component, OnInit, AfterViewInit, ElementRef,Renderer2, ViewChild, ViewContainerRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, AfterViewInit {
	opacity:number = 100;
	compHeight:number = 0;
	compHeightInit:number = 0;
	subheaderVisible:boolean = true;

	pages:Array<String> = ["Home","Portfolio","Blog","Resume"];



	@ViewChild('jumboDescription', { read: ViewContainerRef })
	jumboDescription!: ViewContainerRef;


	
	constructor(private  el:ElementRef,private renderer:Renderer2){}

	ngOnInit(): void {
		console.log(window.innerWidth)
		if(window.innerWidth < 500){
			this.setIniCompHeight(120);
			this.compHeight = 120;
		}else{
			this.setIniCompHeight(150);
			this.compHeight = 150;
		}
	}
	setIniCompHeight(height:number):void{
		this.compHeightInit = height;
	}

	//@HostListener can bind events. To directives or general window events
	@HostListener('window:scroll',['$event'])
	onScroll($event:Event):void {
		var normalizedScroll:number = 0.0;
		var normalizedHeight:number = 0.0;
		var maxScroll = document.body.scrollHeight - window.innerHeight;
		normalizedScroll = ((scrollY)/(maxScroll))*4;
		normalizedHeight = normalizedScroll; 
		this.compHeight = Math.max(this.el.nativeElement.offsetHeight*(1.0-normalizedHeight),this.el.nativeElement.offsetHeight*0.6);
		this.opacity =  Math.max(100-(normalizedScroll*100),80);
		if(this.opacity <=  80){
			this.subheaderVisible = false;
		}else{
			this.subheaderVisible = true;
		}
	};

 	ngAfterViewInit(): void {
		// this.setCompHeight(this.el.nativeElement.offsetHeight);
	}

}
