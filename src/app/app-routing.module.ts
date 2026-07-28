import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routeConfig: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./host-page/host-page.component").then(
        (m) => m.HostPageComponent,
      ),
    title: "CodebyDP",
  },
  {
    path: "blog",
    loadComponent: () =>
      import("./blog-feed/blog-feed.component").then(
        (m) => m.BlogFeedComponent,
      ),
    title: "CodebyDp Blog",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
