import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AnotherPageComponent} from "./another-page/another-page.component";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HomePageComponent} from "./home-page/home-page.component";
import {ZeldaErrorComponent} from "./zelda-error/zelda-error.component";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AnotherPageComponent,
    ZeldaErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
