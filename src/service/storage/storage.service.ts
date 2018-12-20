import {Injectable} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {
    CompleteMovieSearchRequest,
    Movie,
    MovieHistory,
    MovieResult,
    PartialMovieSearchRequest,
    Poster
} from '../../interfaces/movieInterface';
import {ToastController} from '@ionic/angular';
import {HelperService} from '../helper/helper.service';
import {Constants} from '../constants'



@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(public storage: NativeStorage, public toastController: ToastController, public helperService: HelperService) {
    }

    initMovieFavourites() {
        this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: []});
    }

    initMoviePosters() {
        this.storage.setItem(Constants.MOVIE_POSTER, {data: []});
    }

    initMovieHistory() {
        this.storage.setItem(Constants.MOVIE_HISTORY, {data: []});
    }

    getTest() {
        return this.storage.keys();
    }

    addMovie(movie: Movie) {
        this.storage.getItem(Constants.MOVIE_FAVOURITE).then(data => {
            const movie_tmp = <Movie>{
                id: movie.id,
                imdb_id: movie.imdb_id,
                title: movie.title,
                favourite: movie.favourite,
                year: movie.year
            };

            data.data.push(movie_tmp);
                this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: data.data}).then(() => {
                        this.displayToast('"' + movie.title + '" was added to Favourite List!');
                    },
                    error => console.error('Error storing item', error)
                );
            },
            error => console.error(error)
        );
    }

    getMovies() {
        return this.storage.getItem(Constants.MOVIE_FAVOURITE).then(data => {
                return data.data;
            },
            error => console.error(error)
        );
    }

    deleteMovie(movie) {
        this.storage.getItem(Constants.MOVIE_FAVOURITE).then(data => {
                let arr: Array<Movie> = data.data;
                arr = this.helperService.arrayRemoveById(arr, movie);
                this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: arr}).then(() => {
                        console.log(movie.title + ' deleted!');
                    },
                    error => console.error('Error storing item', error)
                );
            },
            error => console.error(error)
        );
    }

    isInPosterStorage(imdb_id) {
        return this.storage.getItem(Constants.MOVIE_POSTER).then(
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
        return this.storage.getItem(Constants.MOVIE_POSTER).then(data => {
                return data.data.filter(x => x.imdb_id == imdb_id)[0];
            },
            error => console.error(error)
        );
    }

    getAllMoviePosterByID() {
        return this.storage.getItem(Constants.MOVIE_POSTER).then(data => {
                return data.data;
            },
            error => console.error(error)
        );
    }

    addMoviePoster(poster: Poster) {
        this.storage.getItem(Constants.MOVIE_POSTER).then(data => {
            console.log(data);
            data.data.push(poster);
                this.storage.setItem(Constants.MOVIE_POSTER, {data: data.data});
            },
            error => console.error(error)
        );
    }

    addMovieHistory(history: MovieHistory) {
        this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {
                let arr: Array<MovieHistory> = data.data;
                let exists = false;
                arr.forEach(his => {
                    if (history.timestamp === his.timestamp) {
                        his.request = history.request;
                        his.result = history.result;
                        exists = true;
                        return;
                    }
                });
                if (!exists) data.data.push(history);
                this.storage.setItem(Constants.MOVIE_HISTORY, {data: data.data});
            },
            error => console.error(error)
        );
    }

    getHistory() {
        return this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {
                return data.data;
            },
            error => console.error(error)
        );
    }

    getHistoryByDate(from, to) {
        return this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {
                let arr: Array<MovieHistory> = [];
                data.data.forEach(his => {
                    let timestamp= new Date(his.timestamp);
                    let from_date = new Date(from);
                    let to_date = new Date (to);
                    from_date.setHours(0, 0, 0, 0);
                    to_date.setHours(0, 0, 0, 0);
                    timestamp.setHours(0, 0, 0, 0);

                    if(to_date <= timestamp && timestamp <= from_date) {
                        arr.push(his);
                    }
                });
                if(arr.length >= 0)
                    return arr;
                else
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
