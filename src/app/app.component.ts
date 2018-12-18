import {Component} from '@angular/core';

import {Platform, Events} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Network} from '@ionic-native/network/ngx';
import {NetworkServiceService} from '../service/network/network-service.service';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import { Device } from '@ionic-native/device/ngx';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'My Favourites',
            url: '/favourites',
            icon: 'heart'
        },
        {
            title: 'History',
            url: '/history',
            icon: 'clock'
        },
        {
            title: 'Help',
            url: '/help',
            icon: 'help-circle'
        },
        {
            title: 'About',
            url: '/about',
            icon: 'information-circle'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public events: Events,
        public network: Network,
        public networkService: NetworkServiceService,
        private uniqueDeviceID: UniqueDeviceID,
        private device: Device,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.networkService.initializeNetworkEvents();
            this.uniqueDeviceID.get()
                .then((uuid: any) => console.log(uuid))
                .catch((error: any) => console.log(error));
            console.log('Serial: ' + this.device.serial);
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
