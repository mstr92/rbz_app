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

    fav_movies_arr: Array<Movie> = [];
    isSorted = false;
    @ViewChild('slidingList') slidingList;

    constructor(public storageService: StorageService, public helperService: HelperService) {
    }

    ngOnInit() {
        console.log('History set data');
        console.log(this.helperService.favourites)
        console.log(this.helperService.favourites.size)
        if (this.helperService.favourites.size > 0) {
            console.log("1")
            this.helperService.favourites.forEach((value, key) => {
                console.log("2")
                this.fav_movies_arr.push(value);
            });
            this.storageService.loadImages(this.fav_movies_arr);
        }
    }

    async deleteMovie(movie) {
        this.fav_movies_arr = this.helperService.arrayRemoveById(this.fav_movies_arr, movie);
        this.storageService.deleteMapEntry(movie, Constants.MOVIE_FAVOURITE);
        await this.slidingList.closeSlidingItems();
    }

    reorderItems(ev) {
        // this.isSorted = true;
        // let itemToMove = this.fav_movies_arr.splice(ev.detail.from, 1)[0];
        // this.fav_movies_arr.splice(ev.detail.to, 0, itemToMove);
        // console.log()
    }

    saveSortedList() {
        // this.storageService.restructureFavourites(this.fav_movies);
        // this.isSorted = false;
    }

    cancelSortedList() {
        //     this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(value => {
        //         if (value != undefined || value != null) {
        //             this.fav_movies = value;
        //             this.storageService.loadImages(this.fav_movies);
        //         }
        //     });
        //     this.isSorted = false;
        // }
    }
}
