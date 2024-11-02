import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBlockComponent } from "./main-block/main-block.component"

const routeConfig: Routes = [
  {
    path: '',
    component: MainBlockComponent,
    title: 'Daniel Perez Dev'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
