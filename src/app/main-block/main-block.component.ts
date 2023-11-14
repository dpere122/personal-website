import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgControlStatus } from '@angular/forms';
import * as THREE from "three";
import * as threeADDONS from "three/examples/jsm/Addons";

@Component({
	selector: 'app-main-block',
	templateUrl: './main-block.component.html',
	styleUrls: ['./main-block.component.css']
})
export class MainBlockComponent implements OnInit, AfterViewInit{

	@ViewChild('canvas')
	private canvasRef!: ElementRef;

	//* Cube Properties
	@Input() public rotationSpeedX: number = 0.002;
	@Input() public rotationSpeedY: number = 0.002;
	@Input() public size: number = 200;
	@Input() public texture: string = "/assets/crate.png";

	//*Stage properties
	@Input() public cameraZ:number = 150;
	@Input() public fieldOfView:number = 1;
	@Input('nearClipping') public nearClippingPlane:number = 1;
	@Input('farClipping') public farClippingPlane:number = 1000;


	private camera!: THREE.PerspectiveCamera;


	private get canvas(): HTMLCanvasElement{
		return this.canvasRef.nativeElement;
	}
	private loader = new THREE.TextureLoader();
	private geometry = new THREE.BoxGeometry(1,1,1);
	private material = new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)});


	private labelRenderer!:threeADDONS.CSS2DRenderer;
	private titleLabelRender!:threeADDONS.CSS2DObject;

	private cube:THREE.Mesh = new THREE.Mesh(this.geometry,this.material);
	private renderer!: THREE.WebGLRenderer;

	private scene!: THREE.Scene;
	
	//controls
	private controls!:threeADDONS.OrbitControls;
	
	/**
	 * @private
	 * @memberof MainBlockComponent
	*/
	private createScene(){
		var titleLabelElement:HTMLElement = document.createElement('div');
		titleLabelElement.className = 'label';
		titleLabelElement.textContent = 'Daniel Perez';
		titleLabelElement.style.backgroundColor = 'transparent';
		titleLabelElement.style.color = 'white';
		//* Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);
		this.scene.add(this.cube);
		//*camera
		let aspectRatio = this.getAspectRatio();
		this.camera = new THREE.PerspectiveCamera(
			this.fieldOfView,
			aspectRatio,
			this.nearClippingPlane,
			this.farClippingPlane
		)
		this.camera.position.z = this.cameraZ;
		this.controls = new threeADDONS.OrbitControls(this.camera,this.canvas);
		this.titleLabelRender = new threeADDONS.CSS2DObject(titleLabelElement);
		this.titleLabelRender.position.set(-2.2,0.8,0);
		this.scene.add(this.titleLabelRender);
		this.controls.update();
	}

	private getAspectRatio(){
		return this.canvas.clientWidth / this.canvas.clientHeight;
	}

	/**
	 * animate the cub
	 * 
	 * @private
	 * @memberof MainBlockComponent
	 */
	private animateCube(){
		this.controls.update();
	}
	/**
	 * Start the rendering loop
	 * 
	 * @private
	 * @memberof MainBlockComponent
	 */
	private startRenderingLoop(){
		//*Renderer
		// Use canvas elemtn in template
		this.renderer = new THREE.WebGLRenderer({canvas:this.canvas});
		this.renderer.setPixelRatio(devicePixelRatio);
		this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

		this.labelRenderer = new threeADDONS.CSS2DRenderer();
		this.labelRenderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight);
		this.labelRenderer.domElement.style.position = 'absolute';
		this.labelRenderer.domElement.style.top = '200px';
		this.labelRenderer.domElement.style.left = '600px';
		this.labelRenderer.domElement.style.width = '400px';
		this.labelRenderer.domElement.style.height = '400px';

		this.labelRenderer.domElement.style.border = 'solid white';

		document.body.appendChild(this.labelRenderer.domElement);


		let component:MainBlockComponent = this;
		(function render(){
			requestAnimationFrame(render);
			component.renderer.render(component.scene, component.camera);
			component.labelRenderer.render(component.scene,component.camera);
			component.animateCube();
		}());
	}
	constructor(){}

	ngOnInit(): void {
		
	}

	ngAfterViewInit(): void {
		this.createScene();
		this.startRenderingLoop();
	}

}

