import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBlockComponent } from "./HomePage/main-block.component"

const routeConfig: Routes = [
  {
    path: '',
    component: MainBlockComponent,
    title: 'CodebyDP'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
