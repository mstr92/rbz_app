import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {AlertController} from '@ionic/angular';
import {Constants} from '../../service/constants';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    size_favourites = 0;
    size_history = 0;
    size_posters = 0;
    size_ratings = 0;

    constructor(public storageService: StorageService, public alertController: AlertController) {
        this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(data => {
            console.log(data);
            this.size_favourites = data.length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_RATING).then(data => {
            console.log(data);
            this.size_ratings = data.length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_POSTER).then(data => {
            console.log(data);
            this.size_posters = data.length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_HISTORY).then(data => {
            console.log(data);
            this.size_history = data.length;
        });

    }


    ngOnInit() {
    }

    async presentConfirm(entity) {
        const alert = await this.alertController.create({
            header: 'Delete ' + entity,
            message: 'Are you sure to delete <strong>all</strong> entries?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                }, {
                    text: 'Delete',
                    handler: () => {
                        if (entity === 'favourites') {
                            this.storageService.initStorage(Constants.MOVIE_FAVOURITE);
                            this.size_favourites = 0;
                        }
                        if (entity === 'history') {
                            this.storageService.initStorage(Constants.MOVIE_HISTORY);
                            this.size_history = 0;
                        }
                        if (entity === 'posters') {
                            this.storageService.initStorage(Constants.MOVIE_POSTER);
                            this.size_posters = 0;
                        }
                        if (entity === 'ratings') {
                            this.storageService.initStorage(Constants.MOVIE_RATING);
                            this.size_ratings = 0;
                        }
                    }
                }
            ]
        });

        await alert.present();
    }


}
