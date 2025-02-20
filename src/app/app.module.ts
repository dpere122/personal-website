import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainBlockComponent } from './HomePage/main-block.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextWallComponent } from './message-box/text-wall.component';
import { ModelBlockComponent } from './3DModel/model-block.component';
import { BannerComponent } from './banner/banner.component';
import { ResponseBoxComponent } from './response-box/response-box.component';
import { GitWidgetComponent } from './git-widget/git-widget.component';


@NgModule({
  declarations: [
    AppComponent,
    MainBlockComponent,
    TextWallComponent,
    ModelBlockComponent,
    BannerComponent,
    ResponseBoxComponent,
    GitWidgetComponent
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
