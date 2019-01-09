import {Component} from '@angular/core';

import {Events, Platform} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Network} from '@ionic-native/network/ngx';
import {NetworkServiceService} from '../service/network/network-service.service';
import {Device} from '@ionic-native/device/ngx';
import {StorageService} from '../service/storage/storage.service';
import {Constants} from '../service/constants';
import {timer} from 'rxjs/observable/timer';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {HelperService} from '../service/helper/helper.service';
import {ApiService} from '../service/apicalls/api.service';
import {NotificationService} from '../service/push/notification.service';

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
        private statusBar: StatusBar,
        public events: Events,
        public network: Network,
        public networkService: NetworkServiceService,
        private device: Device,
        private storageService: StorageService,
        private screenOrientation: ScreenOrientation,
        public helperService: HelperService,
        public apiService: ApiService,
        public notificationService: NotificationService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.networkService.initializeNetworkEvents();
            this.notificationService.initPushOneSignal();
            this.showSplash = false;
            timer(3000).subscribe(() => this.showSplash = false); // <-- hide animation after 3s
            // Initialize storage
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
                if (!keys.includes(Constants.USER)) {
                    this.storageService.initUser();
                }
                if (!keys.includes(Constants.BACKUP_SNYC)) {
                    this.storageService.initBackup();
                }
                if (!keys.includes(Constants.UUID)) {
                    this.storageService.initUUID();
                }
            });
            // Check if a user is logged in
            this.storageService.getUser().then(data => {
                if (data != null) {
                    this.helperService.username = data.username;
                    this.helperService.isUserLoggedIn = true;
                }
                else {
                    this.helperService.username = '';
                    this.helperService.isUserLoggedIn = false;
                }
            });
            // Check if device is already registered. If not, register in database
            this.storageService.getUUID().then(is_set => {
                if (!is_set.data) {
                    this.apiService.setUUID(this.device.uuid).then(data => {
                        if (data.status = 201) {
                            this.storageService.setUUID();
                        }
                    });
                }
            });
            this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(data => {
                this.helperService.favourites = data;
            });
            this.storageService.getStorageEntries(Constants.MOVIE_RATING).then(data => {
                this.helperService.ratings = data;
            });
        });
        this.statusBar.styleDefault();

    }

}
