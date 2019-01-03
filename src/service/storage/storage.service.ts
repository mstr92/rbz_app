import {Injectable} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {
    Movie,
    MovieHistory,
    Poster
} from '../../interfaces/movieInterface';
import {ToastController} from '@ionic/angular';
import {HelperService} from '../helper/helper.service';
import {Constants} from '../constants';
import {ApiService} from '../apicalls/api.service';


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(public storage: NativeStorage, public toastController: ToastController, public helperService: HelperService, private apiService: ApiService) {
    }

    getKeys() {
        return this.storage.keys();
    }

    initStorage(storage_name) {
        this.storage.setItem(storage_name, {data: []});
    }

    getStorageEntries(storage_name) {
        return this.storage.getItem(storage_name).then(data => {
                return data.data;
            },
            error => console.error(error)
        );
    }

    deleteEntry(movie, storage_name) {
        this.storage.getItem(storage_name).then(data => {
                let arr: Array<Movie> = data.data;
                arr = this.helperService.arrayRemoveById(arr, movie);
                this.storage.setItem(storage_name, {data: arr});
            },
            error => console.error(error)
        );
    }
    restructureFavourties(movie_arr) {
        this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: movie_arr})
    }
    addMovieToFavourites(movie: Movie) {
        this.storage.getItem(Constants.MOVIE_FAVOURITE).then(data => {
                const movie_tmp = <Movie>{
                    id: movie.id,
                    imdb_id: movie.imdb_id,
                    title: movie.title,
                    favourite: movie.favourite,
                    year: movie.year,
                    rating: movie.rating
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

    addMovieToRating(movie: Movie) {
        this.storage.getItem(Constants.MOVIE_RATING).then(data => {
                const movie_tmp = <Movie>{
                    id: movie.id,
                    imdb_id: movie.imdb_id,
                    title: movie.title,
                    favourite: movie.favourite,
                    year: movie.year,
                    rating: movie.rating
                };
                let arr = data.data;
                data.data.forEach(mov => {
                    if (mov.id == movie.id) {
                        console.log(mov.title + ' in array');
                        arr = this.helperService.arrayRemoveById(arr, mov);
                    }
                });
                arr.push(movie_tmp);
                this.storage.setItem(Constants.MOVIE_RATING, {data: arr});
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
                    if (imdb_id === poster.imdb_id) {
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

    addMoviePoster(poster: Poster) {
        this.storage.getItem(Constants.MOVIE_POSTER).then(data => {
                let arr = data.data;
                arr.push(poster);
                this.storage.setItem(Constants.MOVIE_POSTER, {data: arr});
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

    getHistoryByDate(from, to) {
        return this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {
                let arr: Array<MovieHistory> = [];
                data.data.forEach(his => {
                    let timestamp = new Date(his.timestamp);
                    let from_date = new Date(from);
                    let to_date = new Date(to);
                    from_date.setHours(0, 0, 0, 0);
                    to_date.setHours(0, 0, 0, 0);
                    timestamp.setHours(0, 0, 0, 0);

                    if (to_date <= timestamp && timestamp <= from_date) {
                        arr.push(his);
                    }
                });
                if (arr.length >= 0)
                    return arr;
                else
                    return data.data;
            },
            error => console.error(error)
        );
    }

    loadImages(array) {
        array.forEach(movie => {
            this.isInPosterStorage(movie.imdb_id).then(is_in_storage => {
                if (is_in_storage) {
                    this.getMoviePosterByID(movie.imdb_id).then(data => movie.image = data.poster);
                }
                else {
                    //TODO: change to rbz.io API call
                    // else: get image from url and store in storage
                    this.apiService.getDetailedMovieInfo1(movie.imdb_id).then(data => {
                        let dataObj: any = JSON.parse(data.data);
                        const url = 'https://image.tmdb.org/t/p/w300/'; //statt w185 -> original
                        const poster = dataObj.movie_results[0].poster_path;
                        this.helperService.convertToDataURLviaCanvas(url + poster, 'image/jpeg')
                            .then(base64Img => {
                                movie.image = base64Img.toString();
                                this.addMoviePoster(<Poster>{imdb_id: movie.imdb_id, poster: base64Img.toString()});
                            });
                    });
                }
            });
        });
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
