import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {MovieHistory, MovieResult, Poster} from '../../interfaces/movieInterface';
import {Result} from '../../assets/data_test';
import {ResultparserService} from '../../service/resultparser/resultparser.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {HelperService} from '../../service/helper/helper.service';
import {LoadingController, NavController} from '@ionic/angular';
import {QuerybuilderService} from '../../service/querybuilder/querybuilder.service';
import {ApiService} from '../../service/apicalls/api.service';


@Component({
    selector: 'app-movie-result',
    templateUrl: './movie-result.page.html',
    styleUrls: ['./movie-result.page.scss'],
})
export class MovieResultPage implements OnInit {
    movies: MovieResult;
    movie_tmp = [];
    movie_rec_rating_map: Map<string, boolean> = new Map<string, boolean>();
    show_more = true;
    no_more_results = false;
    current_timestamp = null;

    constructor(public storageService: StorageService, public parser: ResultparserService, public  socialSharing: SocialSharing,
                public helperService: HelperService, public loadingController: LoadingController, public queryBuilder: QuerybuilderService,
                public navCtrl: NavController, public apiService: ApiService) {
        this.movies = {result: []};
        this.current_timestamp = new Date().toISOString();
    }

    ngOnInit() {
        this.presentLoadingWithOptions().then((data) => {
            this.setData();
            this.loadingController.dismiss();
        });
    }


    addToFavourite(fav) {
        let movie = fav;
        if (fav.favourite) {
            this.storageService.deleteMovie(movie);
        } else {
            this.storageService.addMovie(movie);
        }
        fav.favourite = !fav.favourite;
    }

    refineRequest() {
        this.helperService.movie_request_refine = true;
        this.navCtrl.navigateBack('/movie-query');
    }

    shareResult() {
        let msg = 'Checkout my movie recommendation from *rbz.io*:\n';
        if (this.movies.result != null) {
            this.movies.result.forEach((movie, index) => {
                let idx = index + 1;
                msg += idx + ': ' + movie.title + ' (' + movie.year + ')';
                if (idx != this.movies.result.length) {
                    msg += '\n';
                }
            });
        }
        this.socialSharing.share(msg, null, null);
    }

    openImdb(movie) {
        window.open('https://www.imdb.com/title/' + movie.imdb_id, '_system');
    }

    openAmazonVideo(movie) {
        window.open('https://www.amazon.de/s/?url=search-alias%3Dinstant-video&field-keywords=' + movie.title, '_system');

    }

    openYoutube(movie) {
        window.open('  https://www.youtube.com/results?search_query=' + movie.title + '+' + movie.year + '+trailer', '_system');

    }

    setRating(rating, movie) {
        movie.rating = rating;
        this.storageService.addMovieRating(movie);
    }

    displayRecommendationRating(movie) {
        this.movie_rec_rating_map[movie.id] = false;
    }

    setRecommendationRating(rating, movie) {
        for (let i = 1; i <= 5; i++) {
            let id = 'recrating' + i.toString() + movie.id.toString();
            let img_id = 'recrating' + i.toString() + 'img' + movie.id.toString();
            const clazz = i == rating ? 'rate-thumps rate-selected' : 'rate-thumps';
            let img = document.getElementById(img_id) as HTMLImageElement;
            img.src = i == rating ? '../../assets/image/rating/' + i.toString() + '_full.svg' : '../../assets/image/rating/' + i.toString() + '_line.svg';
            document.getElementById(id).className = clazz;
        }
    }

    disableFavourite(movie) {
        if (this.movie_tmp.includes(movie)) {
            this.movie_tmp = this.helperService.arrayRemoveById(this.movie_tmp, movie);
        } else {
            this.movie_tmp.push(movie);
        }
    }

    disableCorrectFavourite(movie) {
        return !(this.movie_tmp.includes(movie));
    }

    showMore() {
        this.show_more = !this.show_more;
        let more_movies = this.parser.parseMovieResult(Result.res, this.current_timestamp);
        if (more_movies.length <= this.movies.result.length) {
            this.no_more_results = true;
        } else {
            more_movies.forEach(mmovie => {
                let in_arr = false;
                this.movies.result.forEach((cmovie, index) => {
                    if (mmovie.id === cmovie.id) in_arr = true;
                    if (index === this.movies.result.length - 1 && !in_arr) {
                        this.movies.result.push(mmovie);
                        this.movie_rec_rating_map[mmovie.id] = true;
                    }
                });
            });
            this.helperService.movie_request_to_pass.length += 5;
            this.checkIfInFavourites();
            this.loadImages();
            this.checkIfInRatings();
        }
        this.show_more = !this.show_more;
    }

    checkIfInFavourites() {
        this.storageService.getMovies().then(data => {
            if (data != undefined || data != null) {
                data.forEach(element => {
                    this.movies.result.forEach(movie => {
                        if (element.imdb_id == movie.imdb_id) {
                            movie.favourite = true;
                        }
                    });
                });
            }
        });
    }

    checkIfInRatings() {
        this.storageService.getMovieRatings().then(data => {
            if (data != undefined || data != null) {
                data.forEach(element => {
                    this.movies.result.forEach(movie => {
                        if (element.imdb_id == movie.imdb_id) {
                            movie.rating = element.rating;
                        }
                    });
                });
            }
        });
    }

    setData() {
        this.movies.result = this.parser.parseMovieResult(Result.res_short, this.current_timestamp);
        this.checkIfInFavourites();
        this.loadImages();
        this.checkIfInRatings();
        this.movies.result.forEach(movie => {
            this.movie_rec_rating_map[movie.id] = true;
        });
    }

    loadImages() {
        this.movies.result.forEach(movie => {
            this.storageService.isInPosterStorage(movie.imdb_id).then(is_in_storage => {
                // If img in storage:
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

    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            spinner: 'crescent',
            // duration: 2000,
            message: 'Calculating Result! \nPlease wait...',
            translucent: true,
            keyboardClose: true
        });
        // TODO: send query to server, check if a response is send back, go after some time or loaded data to result page
        this.queryBuilder.buildMovieQuery(this.helperService.movie_request_to_pass);
        return await loading.present();
    }

    openFullPoster(event) {
        event.srcElement.className = event.srcElement.className === 'poster small' ? 'poster full' : 'poster small';
    }

}
