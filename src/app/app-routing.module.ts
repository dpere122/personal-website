import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBlockComponent } from "./main-block/main-block.component"

const routeConfig: Routes = [
  {
    path: 'home',
    component: MainBlockComponent,
    title: 'Home Page'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
