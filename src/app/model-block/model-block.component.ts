import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgControlStatus } from '@angular/forms';
import * as THREE from "three";
import * as threeADDONS from "three/examples/jsm/Addons";
import { SIZE } from '../app.component';


@Component({
  selector: 'app-model-block',
  templateUrl: './model-block.component.html',
  styleUrls: ['./model-block.component.css']
})
export class ModelBlockComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
  }

}
