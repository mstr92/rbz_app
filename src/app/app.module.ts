import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, RouteReuseStrategy, Routes} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
// import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {NetworkServiceService} from '../service/network/network-service.service';
import {Network} from '@ionic-native/network/ngx';
import {MovieSearchPageModule} from './movie-search/movie-search.module';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StorageService} from '../service/storage/storage.service';
import {HTTP} from '@ionic-native/http/ngx';
import {NetworkStatusAngularModule} from 'network-status-angular';
import {SocialSharing } from '@ionic-native/social-sharing/ngx'
import {HttpClientModule } from '@angular/common/http';
import {ApiService} from '../service/apicalls/api.service';
import {Device} from '@ionic-native/device/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChangeRatingComponent } from './change-rating/change-rating.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@NgModule({
    declarations: [AppComponent, ChangeRatingComponent],
    entryComponents: [ChangeRatingComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        MovieSearchPageModule,
        NetworkStatusAngularModule.forRoot(),
    ],
    providers: [
        StatusBar,
        NetworkServiceService,
        StorageService,
        Keyboard,
        Network,
        NativeStorage,
        SocialSharing,
        ApiService,
        HTTP,
        Device,
        LocalNotifications,
        Base64,
        OneSignal,
        ScreenOrientation,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
