import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {Movie, Poster} from '../../interfaces/movieInterface';
import {HelperService} from '../../service/helper/helper.service';
import {Constants} from '../../service/constants';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.page.html',
    styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

    fav_movies: Array<Movie> = [];
    isSorted = false;
    @ViewChild('slidingList') slidingList;

    constructor(public storageService: StorageService, public helperService: HelperService) {

        this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(value => {
            this.fav_movies = value;
            if (this.fav_movies != undefined || this.fav_movies != null) {
                this.storageService.loadImages(this.fav_movies);
            }
        });
    }

    ngOnInit() {

    }

    async deleteMovie(movie) {
        this.fav_movies = this.helperService.arrayRemoveById(this.fav_movies, movie);
        this.storageService.deleteEntry(movie, Constants.MOVIE_FAVOURITE);
        await this.slidingList.closeSlidingItems();
    }

    reorderItems(ev) {
        this.isSorted = true;
        let itemToMove = this.fav_movies.splice(ev.detail.from, 1)[0];
        this.fav_movies.splice(ev.detail.to, 0, itemToMove);
    }

    saveSortedList() {
        this.storageService.restructureFavourties(this.fav_movies);
        this.isSorted = false;
    }

    cancelSortedList() {
        this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(value => {
            this.fav_movies = value;
            if (this.fav_movies != undefined || this.fav_movies != null) {
                this.storageService.loadImages(this.fav_movies);
            }
        });
        this.isSorted = false;
    }
}
