import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogFeedComponent } from "./blog-feed/blog-feed.component"
import { HostPageComponent } from './host-page/host-page.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HostPageComponent,
    title: 'CodebyDP'
  },
  {
    path: 'blog',
    component: BlogFeedComponent,
    title: 'CodebyDp Blog'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
