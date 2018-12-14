import {Component, OnInit} from '@angular/core';
import {FavouritesService} from '../../service/favourites/favourites.service';
import {MovieResult} from '../../interfaces/movieInterface';
import {Result} from '../../assets/data_test';
import {ResultparserService} from '../../service/resultparser/resultparser.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {HelperService} from '../../service/helper/helper.service';


@Component({
    selector: 'app-movie-result',
    templateUrl: './movie-result.page.html',
    styleUrls: ['./movie-result.page.scss'],
})
export class MovieResultPage implements OnInit {
    movies: MovieResult;
    movie_tmp = [];
    movie_rec_rating_map: Map<string, boolean> = new Map<string, boolean>();

    constructor(public favService: FavouritesService, public parser: ResultparserService, public  socialSharing: SocialSharing,
                public helperService: HelperService)
{

    this.movies = this.parser.parseMovieResult(Result.res);
    this.favService.getMovies().then(data => {
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
    this.movies.result.forEach(movie => {
        this.movie_rec_rating_map[movie.id] = true;
    });
}




    ngOnInit() {

    }

    addToFavourite(fav) {
        const movie = fav;
        if(fav.favourite) {
            this.favService.deleteMovie(movie);
        } else {
            this.favService.addMovie(movie);
        }
        fav.favourite = !fav.favourite;
    }

    changeRequest() {

    }

    shareResult() {
        let msg = "Checkout my movie recommendation from *rbz.io*:\n";
        if(this.movies.result != null) {
            this.movies.result.forEach((movie, index) => {
                let idx = index + 1;
                msg += idx + ": " +movie.title + " (" + movie.year + ")";
                if (idx != this.movies.result.length) {
                    msg += "\n";
                }
            })
        }
        this.socialSharing.share(msg, null, null).then(() => {
            // Success!
        }).catch(() => {
            // Error!
        });
    }

    openImdb(movie) {
        window.open('https://www.imdb.com/title/' + movie.imdb_id, '_system');
    }

    openAmazonVideo(movie) {
        window.open('https://www.amazon.de/s/?url=search-alias%3Dinstant-video&field-keywords=' + movie.title, '_system');

    }
    openYoutube(movie) {
        window.open('  https://www.youtube.com/results?search_query=' + movie.title + "+" + movie.year + "+trailer", '_system');

    }

    setRating(rating, movie) {
        movie.rating = rating;
        for (let i = 1; i <= 5; i++) {
            let id = 'rating' + i.toString() + movie.id.toString();
            const clazz = i <= rating ? 'rating-yellow' : 'rating-light';
            document.getElementById(id).className = clazz;
        }
        //TODO: send rating to database
    }
    displayRecommendationRating(movie) {
        this.movie_rec_rating_map[movie.id] = false;
    }
    setRecommendationRating(rating, movie){
        for (let i = 1; i <= 5; i++) {
            let id = 'recrating' + i.toString() + movie.id.toString();
            let img_id = 'recrating' + i.toString() + 'img' + movie.id.toString();
            const clazz = i == rating ? 'rate-thumps rate-selected' : 'rate-thumps';
            let img = document.getElementById(img_id) as HTMLImageElement;
            img.src = i == rating ? "../../assets/image/rating/" + i.toString() +"_full.svg" : "../../assets/image/rating/" + i.toString() +"_line.svg";
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
}
