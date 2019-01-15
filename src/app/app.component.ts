import {Component, OnInit} from '@angular/core';

import {Events, NavController, Platform} from '@ionic/angular';
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
import {Movie} from '../interfaces/movieInterface';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent{
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
            title: 'Tour',
            url: '/tour',
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
        public notificationService: NotificationService,
        public navCtrl: NavController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.networkService.initializeNetworkEvents();
            this.showSplash = false;

            this.storageService.getStorageEntries(Constants.NOT_SHOW_INTRO).then(data => {
                if(data == false) {
                    this.navCtrl.navigateRoot('/tour');
                }
            });

            timer(3000).subscribe(() => {
                this.showSplash = false;
            }); // <-- hide animation after 3s
            // Initialize storage
           this.initStorages();
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
            },error => console.log(error));
            // Check if device is already registered. If not, register in database
            this.storageService.getStorageEntries(Constants.UUID).then(is_set => {
                if (!is_set.data) {
                    this.apiService.setUUID(this.device.uuid).then(data => {
                        if (data.status = 201) {
                            this.storageService.setUUID(true);
                        }
                    });
                }
            }, error => console.log(error));
            // Set data in helperService
            this.helperService.favourites = new Map<string, Movie>();
            this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(data => {
                this.helperService.favourites = new Map(Object.entries(data));
            }, error => console.log(error));

            this.helperService.ratings = new Map<string, Movie>();
            this.storageService.getStorageEntries(Constants.MOVIE_RATING).then(data => {
                this.helperService.ratings = new Map(Object.entries(data));
            }, error => console.log(error));

            this.helperService.waiting_for_movie_result = false;
            this.storageService.getStorageEntries(Constants.MOVIE_WAIT).then(data => {
                this.helperService.waiting_for_movie_result = data;
            }, error => console.log(error));

            this.helperService.movie_request_to_pass =  {entity: '', data: {}, length: 0};
            this.storageService.getStorageEntries(Constants.MOVIE_REQUEST).then(data => {
                this.helperService.movie_request_to_pass = data;
            }, error => console.log(error));

            this.storageService.getStorageEntries(Constants.MOVIE_CURRENT_RESPONSE).then(data => {
                this.helperService.movie_result_to_display = data;
            }, error => console.log(error));

            this.storageService.getStorageEntries(Constants.SHOW_MORE).then(data => {
                this.helperService.result_show_more = data;
            }, error => console.log(error));

            this.notificationService.initPushOneSignal();
        });
        this.statusBar.hide();
    }

    initStorages() {
        this.storageService.getKeys().then(keys => {
            if (!keys.includes(Constants.MOVIE_FAVOURITE)) {
                this.storageService.initFavourites();
            }
            if (!keys.includes(Constants.MOVIE_HISTORY)) {
                this.storageService.initHistory();
            }
            if (!keys.includes(Constants.MOVIE_RATING)) {
                this.storageService.initRating();
            }
            if (!keys.includes(Constants.USER)) {
                this.storageService.initStorage(Constants.USER, null);
            }
            if (!keys.includes(Constants.BACKUP_SNYC)) {
                this.storageService.initStorage(Constants.BACKUP_SNYC, null);
            }
            if (!keys.includes(Constants.UUID)) {
                this.storageService.initStorage(Constants.UUID, false);
            }
            if (!keys.includes(Constants.MOVIE_REQUEST)) {
                this.storageService.initStorage(Constants.MOVIE_REQUEST, null);
            }
            if (!keys.includes(Constants.MOVIE_WAIT)) {
                this.storageService.initStorage(Constants.MOVIE_WAIT, false);
            }
            if (!keys.includes(Constants.NOT_SHOW_INTRO)) {
                this.storageService.initStorage(Constants.NOT_SHOW_INTRO, false);
            }
            if (!keys.includes(Constants.SHOW_MORE)) {
                this.storageService.initStorage(Constants.SHOW_MORE, false);
            }
            if (!keys.includes(Constants.MOVIE_CURRENT_RESPONSE)) {
                this.storageService.initStorage(Constants.MOVIE_CURRENT_RESPONSE, null);
            }
        });
    }

}
