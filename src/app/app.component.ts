import {Component} from '@angular/core';

import {Platform, Events, ModalController} from '@ionic/angular';
// import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Network} from '@ionic-native/network/ngx';
import {NetworkServiceService} from '../service/network/network-service.service';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {Device} from '@ionic-native/device/ngx';
import {StorageService} from '../service/storage/storage.service';
import {Constants} from '../service/constants';
import { timer } from 'rxjs/observable/timer';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

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
            title: 'My Ratings',
            url: '/ratings',
            icon: 'star'
        },
        {
            title: 'History',
            url: '/history',
            icon: 'clock'
        },
        {
            title: 'Settings',
            url: '/settings',
            icon: 'settings'
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

    showSplash = true;

    constructor(
        private platform: Platform,
        // private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public events: Events,
        public network: Network,
        public networkService: NetworkServiceService,
        private uniqueDeviceID: UniqueDeviceID,
        private device: Device,
        private storageService: StorageService,
        private screenOrientation: ScreenOrientation
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            //this.splashScreen.hide();
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.networkService.initializeNetworkEvents();
            this.uniqueDeviceID.get()
                .then((uuid: any) => console.log(uuid))
                .catch((error: any) => console.log(error));
            console.log('Serial: ' + this.device.serial);

            this.storageService.getKeys().then(keys => {
                if (!keys.includes(Constants.MOVIE_FAVOURITE)) {
                    this.storageService.initStorage(Constants.MOVIE_FAVOURITE);
                }
                if (!keys.includes(Constants.MOVIE_HISTORY)) {
                    this.storageService.initStorage(Constants.MOVIE_HISTORY);
                }
                if (!keys.includes(Constants.MOVIE_POSTER)) {
                    this.storageService.initStorage(Constants.MOVIE_POSTER);
                }
                if (!keys.includes(Constants.MOVIE_RATING)) {
                    this.storageService.initStorage(Constants.MOVIE_RATING);
                }
            });

        });
        this.statusBar.styleDefault();
        this.showSplash = false;
        timer(3000).subscribe(() => this.showSplash = false) // <-- hide animation after 3s
    }

}
