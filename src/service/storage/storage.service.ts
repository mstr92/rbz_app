import {Injectable} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Movie, MovieHistory, Poster} from '../../interfaces/movieInterface';
import {ToastController} from '@ionic/angular';
import {HelperService} from '../helper/helper.service';

const MOVIE_FAVOURITE = 'favouriteMovies';
const MOVIE_POSTER = 'posterMovies';
const MOVIE_HISTORY = 'movie_history';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(public storage: NativeStorage, public toastController: ToastController, public helperService: HelperService) {
    }

    initMovieFavourites() {
        this.storage.setItem(MOVIE_FAVOURITE, {data: []});
    }
    initMoviePosters() {
        this.storage.setItem(MOVIE_POSTER, {data: []});
    }
    initMovieHistory() {
        this.storage.setItem(MOVIE_HISTORY, {data: []});
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

    isInPosterStorage(imdb_id) {
        return this.storage.getItem(MOVIE_POSTER).then(
            data => {
                let arr: Array<Poster> = data.data;
                let exists = false;
                arr.forEach(poster => {
                    if(imdb_id === poster.imdb_id) {
                        exists = true;
                        return;
                    }
                });
                return exists;
            },
            error => {
                console.error(error);
                return false;
            }
        );
    }

    getMoviePosterByID(imdb_id) {
        return this.storage.getItem(MOVIE_POSTER).then(data => {
                return data.data.filter(x => x.imdb_id == imdb_id)[0];
            },
            error => console.error(error)
        );
    }
    getAllMoviePosterByID() {
        return this.storage.getItem(MOVIE_POSTER).then(data => {
                return data.data;
            },
            error => console.error(error)
        );
    }
    addMoviePoster(poster: Poster) {
        this.storage.getItem(MOVIE_POSTER).then(data => {
                data.data.push(poster);
                this.storage.setItem(MOVIE_POSTER, {data: data.data});
            },
            error => console.error(error)
        );
    }

    addMovieHistory(history: MovieHistory) {
        this.storage.getItem(MOVIE_HISTORY).then(data => {
                let arr: Array<MovieHistory> = data.data;
                let exists = false;
                arr.forEach(his => {
                    if(history.timestamp === his.timestamp) {
                        his.request = history.request;
                        his.result = history.result
                        exists = true;
                        return;
                    }
                });
                if(!exists) data.data.push(history);
                this.storage.setItem(MOVIE_HISTORY, {data: data.data});
            },
            error => console.error(error)
        );
    }
    getHistory() {
        return this.storage.getItem(MOVIE_HISTORY).then(data => {
                return data.data;
            },
            error => console.error(error)
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
