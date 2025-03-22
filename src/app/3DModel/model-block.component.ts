import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import * as threeADDONS from "three/examples/jsm/Addons";

@Component({
	selector: 'app-model-block',
	templateUrl: './model-block.component.html',
	styleUrls: ['./model-block.component.css']
})
export class ModelBlockComponent implements OnInit, AfterViewInit {

	@ViewChild('canvas')
	private canvasRef!: ElementRef;

	private get canvas(): HTMLCanvasElement{
		return this.canvasRef.nativeElement;
	}

	private gltfLoader!:threeADDONS.GLTFLoader;
	private camera!:THREE.PerspectiveCamera;
	private light:THREE.DirectionalLight = new THREE.DirectionalLight(0xFFFFFF);
	private model!:THREE.Group;
	// private controls!:threeADDONS.OrbitControls;

	private scene!:THREE.Scene;
	private renderer!:THREE.WebGLRenderer;

	@Input() modelURL:string = "";
	@Input() scale:number = 0.4;
	@Input() verticalOffset:number = 20;


	ngOnInit(): void {

	}
	ngAfterViewInit(): void {
		this.createScene();
		this.loadModel(this.modelURL);
		this.startRenderingLoop();
	}

	private createScene(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(70,this.getAspectRatio(),0.1,2000);
		this.camera.position.set(0,20,5);

		// this.controls = new threeADDONS.OrbitControls(this.camera,this.canvas);
		// this.controls.target.set(0,20,0.5)
		// this.controls.enablePan = false;
		// this.controls.enableZoom = false;
		// this.controls.enableRotate = false;
		// this.controls.autoRotate = true;
		// this.controls.autoRotateSpeed = 2;
		// this.controls.update();

		// //create test cube
		// var planeGeometry = new THREE.PlaneGeometry(100,100,1,1);
		// var planeMaterial = new THREE.MeshStandardMaterial({color:0x000000});

		// const plane = new THREE.Mesh(planeGeometry,planeMaterial);
		// plane.rotation.x = -Math.PI/2
		// this.scene.add(plane);

		//create test light
		
		this.light.position.set(1,40,15);
		this.light.target.position.set(10,40,0);
		this.light.castShadow = true;
		this.light.intensity = 4;
		// this.light.shadow.bias = -0.01;
		// this.light.shadow.mapSize.width = 1000;
		// this.light.shadow.mapSize.height = 1000;
		// this.light.shadow.camera.near = 1.0;
		// this.light.shadow.camera.far = 500;
		// this.light.shadow.camera.left = 200;
		// this.light.shadow.camera.right = -200;
		// this.light.shadow.camera.top = 200;
		// this.light.shadow.camera.bottom = -200;
		this.scene.add(this.light);

		// var ambLight = new THREE.PointLight(0x08f700)
		// ambLight.position.set(0,20,100);
		// ambLight.intensity = 0.1
		// ambLight.castShadow = true;
		// this.scene.add(ambLight);

	}

	private loadModel(path:string){
		this.gltfLoader = new threeADDONS.GLTFLoader();
		this.gltfLoader.load(path,(gltfScene)=>{
			//callback to occur when the loader has loaded the model
			gltfScene.scene.position.set(0,this.verticalOffset,0);
			gltfScene.scene.scale.set(this.scale,this.scale,this.scale);
			//add the model to the scene
			this.model = gltfScene.scene;
			this.scene.add(this.model);
		});
	}

	private startRenderingLoop(){
		this.renderer = new THREE.WebGLRenderer({canvas:this.canvas,alpha:true});
		this.renderer.setClearColor(0x000000,0);
		this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight);
		this.renderer.setPixelRatio(devicePixelRatio);
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		let component:ModelBlockComponent = this;
		(function render(){
			requestAnimationFrame(render);
			component.renderer.render(component.scene,component.camera);
			if(component.model !== undefined){
				component.model.rotateY(0.005);
			}
			// component.controls.update();
		}());
	}

	private getAspectRatio(){
		return this.canvas.clientWidth / this.canvas.clientHeight;
	}
}
