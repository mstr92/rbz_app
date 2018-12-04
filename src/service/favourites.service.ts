import {Injectable} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Movie} from '../interfaces/movieInterface';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class FavouritesService {

    constructor(public storage: NativeStorage, public toastController: ToastController) {
    }

    clearMovieHistory() {
        const arr: Array<Movie> = [];
        this.storage.setItem('favouriteMovies', {data: arr})
            .then(
                () => console.log('Stored item!!!'),
                error => console.error('Error storing item', error)
            );
    }

    addMovie(movie) {
        this.storage.getItem('favouriteMovies')
            .then(
                data => {
                    const arr: Array<Movie> = data.data;
                    arr.push(movie);
                    this.storage.setItem('favouriteMovies', {data: arr})
                        .then(
                            () => {
                                this.displayToast('"' + movie.title + '" was added to Favourite List!');
                            },
                            error => console.error('Error storing item', error)
                        );
                },
                error => console.error(error)
            );
    }

    getMovies() {
        return this.storage.getItem('favouriteMovies')
            .then(
                data => {return data.data},
                error => console.error(error)
            );
    }

    deleteMovie(movie) {
        this.storage.getItem('favouriteMovies')
            .then(
                data => {
                    let arr: Array<Movie> = data.data;
                    arr = this.arrayRemoveById(arr, movie);
                    console.log(arr);
                    this.storage.setItem('favouriteMovies', {data: arr})
                        .then(
                            () => {console.log(movie.title + " deleted!");
                            },
                            error => console.error('Error storing item', error)
                        );
                },
                error => console.error(error)
            );
    }

    isInFavStorage(movie) {
        return this.storage.getItem('favouriteMovies')
        .then(
            data => {
                let arr: Array<Movie> = data.data;
                arr = this.arrayRemoveById(arr, movie);
                const checkRoleExistence = roleParam => arr.some( ({imdb_id}) => imdb_id == roleParam);
                return checkRoleExistence(movie);
            },
            error => {
                console.error(error);
                return false;
            }

        );

    }

    async displayToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            showCloseButton: true,
            position: 'bottom',
            closeButtonText: 'close',
            duration: 2000
        });
        toast.present();
    }
    private arrayRemoveById(arr, value) {
        return arr.filter(function (ele) {
            return ele.id !== value.id;
        });
    }
}
