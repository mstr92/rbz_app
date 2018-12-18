import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {Movie} from '../../interfaces/movieInterface';
import {HelperService} from '../../service/helper/helper.service';
import {__importDefault} from 'tslib/tslib';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.page.html',
    styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

    fav_movies: Array<Movie>;
    @ViewChild('slidingList') slidingList;
    constructor(public storageService: StorageService, public helperService:HelperService) {

        this.storageService.getMovies().then(value => this.fav_movies = value);
    }

    ngOnInit() {

    }

    async deleteMovie(movie) {
        this.fav_movies = this.helperService.arrayRemoveById(this.fav_movies, movie);
        this.storageService.deleteMovie(movie);
        await this.slidingList.closeSlidingItems();
    }


}
