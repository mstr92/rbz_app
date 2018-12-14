import {Component, OnInit, ViewChild} from '@angular/core';
import {FavouritesService} from '../../service/favourites/favourites.service';
import {Movie} from '../../interfaces/movieInterface';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.page.html',
    styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

    fav_movies: Array<Movie>;
    @ViewChild('slidingList') slidingList;
    constructor(public favService: FavouritesService) {

        // this.fav_movies = [];
        // this.fav_movies.push(<Movie>{id: 1, imdb_id:2 , title: "test", year: 2007, favourite: true, image: ""});
        // this.fav_movies.push(<Movie>{id: 1, imdb_id:2 , title: "test2", year: 2007, favourite: true, image: ""});
        // this.fav_movies.push(<Movie>{id: 1, imdb_id:2 , title: "test2", year: 2007, favourite: true, image: ""});

        this.favService.getMovies().then(value => this.fav_movies = value);
    }

    ngOnInit() {

    }

    async deleteMovie(movie) {
        this.fav_movies = this.arrayRemoveById(this.fav_movies, movie);
        this.favService.deleteMovie(movie);
        await this.slidingList.closeSlidingItems();
    }

    private arrayRemoveById(arr, value) {
        return arr.filter(function (ele) {
            return ele.id !== value.id;
        });
    }


}
