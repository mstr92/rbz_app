import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, RouteReuseStrategy, Routes} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {MovieQueryPageModule} from './movie-query/movie-query.module';
import {NetworkServiceService} from '../service/network/network-service.service';
import {Network} from '@ionic-native/network/ngx';
import {MovieSearchPageModule} from './movie-search/movie-search.module';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {FavouritesService} from '../service/favourites/favourites.service';
import {HTTP} from '@ionic-native/http/ngx';
import {NetworkStatusAngularModule} from 'network-status-angular';
import {SocialSharing } from '@ionic-native/social-sharing/ngx'

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        // MovieQueryPageModule,
        MovieSearchPageModule,
        NetworkStatusAngularModule.forRoot(),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        NetworkServiceService,
        FavouritesService,
        Keyboard,
        Network,
        HTTP,
        NativeStorage,
        SocialSharing,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
