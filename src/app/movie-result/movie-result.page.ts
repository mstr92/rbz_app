import {Component, OnInit, ViewChild, ɵNgModuleType} from '@angular/core';
import {FavouritesService} from '../../service/favourites.service';
import {Movie, MovieResult} from '../../interfaces/movieInterface';
import {Result} from '../../assets/data_test';
import {ResultparserService} from '../../service/resultparser.service';
import {element} from 'protractor';


@Component({
    selector: 'app-movie-result',
    templateUrl: './movie-result.page.html',
    styleUrls: ['./movie-result.page.scss'],
})
export class MovieResultPage implements OnInit {
    movies: MovieResult;
    movie_tmp = [];

    constructor(public favService: FavouritesService, public parser: ResultparserService) {
        this.movies = this.parser.parseMovieResult(Result.res);

        this.favService.getMovies().then(data => {
            data.forEach(element => {
                this.movies.result.forEach(movie => {
                    if(element.imdb_id == movie.imdb_id) {
                        movie.favourite = true;
                    }
                })
            })
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

    saveResult() {
    }

    openImdb(movie) {
        window.open('https://www.imdb.com/title/' + movie.imdb_id, '_system');
    }

    openAmazonVideo(movie) {
        window.open('https://www.amazon.de/s/?url=search-alias%3Dinstant-video&field-keywords=' + movie.title, '_system');

    }

    setRating(rating, movie) {
        movie.rating = rating;
        for (let i = 1; i <= 5; i++) {
            let id = 'rating' + i.toString() + movie.id.toString();
            const clazz = i <= rating ? 'rating-yellow' : 'rating-light';
            document.getElementById(id).className = clazz;
        }
    }

    disableFavourite(movie) {
        if (this.movie_tmp.includes(movie)) {
            this.movie_tmp = this.arrayRemoveById(this.movie_tmp, movie);
        } else {
            this.movie_tmp.push(movie);
        }
    }

    disableCorrectFavourite(movie) {
        return !(this.movie_tmp.includes(movie));
    }

    private arrayRemoveById(arr, value) {
        return arr.filter(function (ele) {
            return ele.id !== value.id;
        });
    }
}
