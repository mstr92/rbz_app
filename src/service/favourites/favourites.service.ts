import {Injectable} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Movie} from '../../interfaces/movieInterface';
import {ToastController} from '@ionic/angular';
import {HelperService} from '../helper/helper.service';

const MOVIE_FAVOURITE = 'favouriteMovies';

@Injectable({
    providedIn: 'root'
})
export class FavouritesService {

    constructor(public storage: NativeStorage, public toastController: ToastController, public helperService: HelperService) {
    }

    clearMovieHistory() {
        this.storage.setItem(MOVIE_FAVOURITE, {data: []});
    }

    addMovie(movie: Movie) {
        this.storage.getItem(MOVIE_FAVOURITE).then(data => {
                data.data.push(movie);
                this.storage.setItem(MOVIE_FAVOURITE, {data: data.data}).then(() => {
                        this.displayToast('"' + movie.title + '" was added to Favourite List!');
                    },
                    error => console.error('Error storing item', error)
                );
            },
            error => console.error(error)
        );
    }

    getMovies() {
        return this.storage.getItem(MOVIE_FAVOURITE).then(data => {
                    return data.data;
                },
                error => console.error(error)
            );
    }

    deleteMovie(movie) {
        this.storage.getItem(MOVIE_FAVOURITE).then(data => {
                    let arr: Array<Movie> = data.data;
                    arr = this.helperService.arrayRemoveById(arr, movie);
                    this.storage.setItem(MOVIE_FAVOURITE, {data: arr}).then(() => {
                                console.log(movie.title + ' deleted!');
                            },
                            error => console.error('Error storing item', error)
                        );
                },
                error => console.error(error)
            );
    }

    isInFavStorage(movie) {
        return this.storage.getItem(MOVIE_FAVOURITE).then(
                data => {
                    let arr: Array<Movie> = data.data;
                    arr = this.helperService.arrayRemoveById(arr, movie);
                    const checkExistence = roleParam => arr.some(({imdb_id}) => imdb_id == roleParam);
                    return checkExistence(movie);
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
            duration: 2000,
            cssClass: 'test-toast'
        });
        toast.present();
    }
}
