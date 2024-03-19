import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainBlockComponent } from './main-block/main-block.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextWallComponent } from './text-wall/text-wall.component';
import { ModelBlockComponent } from './model-block/model-block.component';
import { BannerComponent } from './banner/banner.component';


@NgModule({
  declarations: [
    AppComponent,
    MainBlockComponent,
    TextWallComponent,
    ModelBlockComponent,
    BannerComponent,
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
