import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogFeedComponent } from './blog-feed/blog-feed.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextWallComponent } from './message-box/text-wall.component';
import { ModelBlockComponent } from './3DModel/model-block.component';
import { BannerComponent } from './banner/banner.component';
import { PortfiolioGalleryComponent } from './portfiolio-gallery/portfiolio-gallery.component';


@NgModule({
  declarations: [
    AppComponent,
    BlogFeedComponent,
    TextWallComponent,
    ModelBlockComponent,
    BannerComponent,
    PortfiolioGalleryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
