import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {MovieQueryPageModule} from './movie-query/movie-query.module';
import {NetworkServiceService} from '../service/network-service.service';
import {Network} from '@ionic-native/network/ngx';
import {MovieSearchPageModule} from './movie-search/movie-search.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MovieQueryPageModule,
    MovieSearchPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NetworkServiceService,
    Keyboard,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
