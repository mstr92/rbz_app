import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {AlertController} from '@ionic/angular';

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
        this.storageService.getMovies().then(data => {
            console.log(data);
            this.size_favourites = data.length;
        });
        this.storageService.getMovieRatings().then(data => {
            console.log(data);
            this.size_ratings = data.length;
        });
        this.storageService.getAllMoviePosterByID().then(data => {
            console.log(data);
            this.size_posters = data.length;
        });
        this.storageService.getHistory().then(data => {
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
                            this.storageService.initMovieFavourites();
                            this.size_favourites = 0;
                        }
                        if (entity === 'history') {
                            this.storageService.initMovieHistory();
                            this.size_history = 0;
                        }
                        if (entity === 'posters') {
                            this.storageService.initMoviePosters();
                            this.size_posters = 0;
                        }
                        if (entity === 'ratings') {
                            this.storageService.initMovieRating();
                            this.size_ratings = 0;
                        }
                    }
                }
            ]
        });

        await alert.present();
    }


}
