import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {Movie, Poster} from '../../interfaces/movieInterface';
import {HelperService} from '../../service/helper/helper.service';
import {__importDefault} from 'tslib/tslib';
import {ApiService} from '../../service/apicalls/api.service';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.page.html',
    styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

    fav_movies: Array<Movie> = [];
    @ViewChild('slidingList') slidingList;

    constructor(public storageService: StorageService, public helperService: HelperService, public apiService: ApiService) {

        this.storageService.getMovies().then(value => {
            this.fav_movies = value;
            if (this.fav_movies != undefined || this.fav_movies != null) {
                this.loadImages();
            }
        });
    }

    ngOnInit() {

    }

    async deleteMovie(movie) {
        this.fav_movies = this.helperService.arrayRemoveById(this.fav_movies, movie);
        this.storageService.deleteMovie(movie);
        await this.slidingList.closeSlidingItems();
    }

    loadImages() {
        this.fav_movies.forEach(movie => {
            this.storageService.isInPosterStorage(movie.imdb_id).then(is_in_storage => {
                if (is_in_storage) {
                    this.storageService.getMoviePosterByID(movie.imdb_id).then(data => movie.image = data.poster);
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
                                this.storageService.addMoviePoster(<Poster>{imdb_id: movie.imdb_id, poster: base64Img.toString()});
                            });
                    });
                }
            });
        });
    }

}
