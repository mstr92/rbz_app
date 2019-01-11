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
import {BackupDate, User} from '../../interfaces/generalInterface';


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(public storage: NativeStorage, public toastController: ToastController, public helperService: HelperService, private apiService: ApiService) {
    }
    clearFull() {
        this.storage.clear();
    }
    getKeys() {
        return this.storage.keys();
    }

    initUser() {
        this.storage.setItem(Constants.USER, {data: null});
    }

    initBackup() {
        this.storage.setItem(Constants.BACKUP_SNYC, {data: null});
    }

    initUUID() {
        this.storage.setItem(Constants.UUID, {data: false});
    }

    setUUID() {
        return this.storage.setItem(Constants.UUID, {data: true});
    }

    getUUID() {
        return this.storage.getItem(Constants.UUID);
    }

    setFullData(storage_name, data) {
        return this.storage.setItem(storage_name, {data: data});
    }

    getStorageEntries(storage_name) {
        return this.storage.getItem(storage_name).then(data => {
                return data.data;
            },
            error => console.error(error)
        );
    }

    deleteEntry(history, storage_name) {
        this.storage.getItem(storage_name).then(data => {
                delete data.data[history.timestamp];
                this.storage.setItem(storage_name, {data: data.data});
            },
            error => console.error(error)
        );
    }

    deleteMapEntry(movie, storage_name) {
        this.storage.getItem(storage_name).then(data => {
                delete data.data[movie.imdb_id];
                if (storage_name == Constants.MOVIE_RATING) this.helperService.ratings = new Map(Object.entries(data.data));
                if (storage_name == Constants.MOVIE_FAVOURITE) this.helperService.favourites = new Map(Object.entries(data.data));
                this.storage.setItem(storage_name, {data: data.data});
            },
            error => console.error(error)
        );
    }

    // restructureFavourites(movie_arr) {
    //     this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: movie_arr});
    // }


    addUser(user: User) {
        this.storage.setItem(Constants.USER, {data: user});
    }

    getUser() {
        return this.storage.getItem(Constants.USER).then(data => {
                if (data.data != []) {
                    return data.data;
                } else {
                    return null;
                }
            },
            error => console.error(error)
        );
    }

    addBackupSync(upload: BackupDate) {
        this.storage.setItem(Constants.BACKUP_SNYC, {data: upload});
    }

    getBackupSync() {
        return this.storage.getItem(Constants.BACKUP_SNYC).then(data => {
            return data.data;
        });
    }


    //---------------------------------------------------------------------------------------------------------
    // Favourites
    //---------------------------------------------------------------------------------------------------------
    initFavourites() {
        this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: new Map<string, Movie>()});
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
                data.data[movie_tmp.imdb_id] = movie_tmp;
                this.helperService.favourites = new Map(Object.entries(data.data));
                this.storage.setItem(Constants.MOVIE_FAVOURITE, {data: data.data}).then(() => {
                        this.displayToast('"' + movie.title + '" was added to Favourite List!');
                    },
                    error => console.error('Error storing item', error)
                );
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

    //---------------------------------------------------------------------------------------------------------
    // Rating
    //---------------------------------------------------------------------------------------------------------
    initRating() {
        this.storage.setItem(Constants.MOVIE_RATING, {data: new Map<string, Movie>()});
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
                if (movie_tmp.imdb_id in data.data) {
                    data.data[movie_tmp.imdb_id].rating = movie.rating;
                } else {
                    data.data[movie_tmp.imdb_id] = movie_tmp;
                }

                this.helperService.ratings = new Map(Object.entries(data.data));
                this.storage.setItem(Constants.MOVIE_RATING, {data: data.data});
            },
            error => console.error(error)
        );
    }

    //---------------------------------------------------------------------------------------------------------
    // Posters
    //---------------------------------------------------------------------------------------------------------
    initPoster() {
        this.storage.setItem(Constants.MOVIE_POSTER, {data: new Map<string, Poster>()});
    }

    getMoviePosterByID(imdb_id) {
        return this.storage.getItem(Constants.MOVIE_POSTER).then(data => {
                return data.data[imdb_id];
            },
            error => console.error(error)
        );
    }

    addMoviePoster(poster: Poster) {
        this.storage.getItem(Constants.MOVIE_POSTER).then(data => {
                data.data[poster.imdb_id] = poster;
                this.storage.setItem(Constants.MOVIE_POSTER, {data: data.data});
            },
            error => console.error(error)
        );
    }

    loadImages(array) {
        if (array != undefined || array != null) {
            array.forEach(movie => {
                this.getMoviePosterByID(movie.imdb_id).then(data => {
                    if (data != undefined) {
                        movie.image = data.poster;
                    }
                    else {
                        this.loadExternalImage(movie, true);
                    }
                });
            });
        }
    }

    loadImagesMap(array) {
        if (array != undefined || array != null) {
            Object.keys(array).forEach(key => {
                const movie = array[key];
                this.getMoviePosterByID(movie.imdb_id).then(data => {
                    if (data != undefined) {
                        movie.image = data.poster;
                    }
                    else {
                        this.loadExternalImage(movie, true);
                    }
                });
            });
        }
    }

    loadExternalImage(movie, store) {
        this.apiService.getDetailedMovieInfo(movie.imdb_id).then(data => {
            if (data != null || data != undefined) {
                let dataObj: any = JSON.parse(data.data);
                let size = store ? 'w300' : 'w92';
                const url = 'https://image.tmdb.org/t/p/' + size + '/';
                const poster = dataObj.movie_results[0].poster_path;
                movie.image = url + poster;
                if (store) {
                    this.helperService.convertToDataURLviaCanvas(url + poster, 'image/jpeg')
                        .then(base64Img => {
                            this.addMoviePoster(<Poster>{imdb_id: movie.imdb_id, poster: base64Img.toString()});
                        });
                }
            }
        });

    }

    //---------------------------------------------------------------------------------------------------------
    // History
    //---------------------------------------------------------------------------------------------------------
    initHistory() {
        this.storage.setItem(Constants.MOVIE_HISTORY, {data: new Map<string, MovieHistory>()});
    }

    addMovieHistory(history: MovieHistory) {
        this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {

                if (history.timestamp in data.data) {
                    data.data[history.timestamp].request = history.request;
                    data.data[history.timestamp].result = history.result;
                } else {
                    data.data[history.timestamp] = history;
                }
                this.storage.setItem(Constants.MOVIE_HISTORY, {data: data.data});
            },
            error => console.error(error)
        );
    }

    setMovieHistoryDetails(movie, timestamp) {
        this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {
                if (timestamp in data.data) {
                    data.data[timestamp].result.result.forEach(mov => {
                        console.log(mov.imdb_id + '  ' + movie.imdb_id);
                        if (mov.imdb_id == movie.imdb_id) {
                            mov.vote = movie.vote;
                        }
                    });
                    this.storage.setItem(Constants.MOVIE_HISTORY, {data: data.data});
                }
            },
            error => console.error(error)
        );
    }

    getHistoryEntries(size, filter, date) {
        return this.storage.getItem(Constants.MOVIE_HISTORY).then(data => {
            let dataMap = new Map(Object.entries(data.data));
            let dataArr = Array.from(dataMap);
            let resArr = [];

            if (filter) {
                let from_date = new Date(date.from);
                let to_date = new Date(date.to);
                from_date.setHours(0, 0, 0, 0);
                to_date.setHours(0, 0, 0, 0);

                dataArr.forEach(entry => {
                    let timestamp = new Date(entry[0]);
                    timestamp.setHours(0, 0, 0, 0);
                    if (to_date <= timestamp && timestamp <= from_date)
                        resArr.push(entry[1]);
                });
                dataArr = resArr;
                resArr = [];
            }

            let length = dataArr.length;
            if (length <= size) {
                dataArr.forEach(entry => {
                    resArr.push(entry[1]);
                });
            } else {
                for (let index = length - 1; index >= length - size; index--) {
                    resArr.push(dataArr[index][1]);
                }
            }
            if (resArr.length >= 0)
                return {total_length: length, data_arr: resArr};
            else return data.data;
        }, error => console.error(error));
    }
}
