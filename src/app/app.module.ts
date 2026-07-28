import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BannerComponent } from "./banner/banner.component";
import { PortfiolioGalleryComponent } from "./portfiolio-gallery/portfiolio-gallery.component";

@NgModule({
  declarations: [AppComponent, BannerComponent, PortfiolioGalleryComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
