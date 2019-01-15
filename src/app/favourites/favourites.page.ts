import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {Movie, Poster} from '../../interfaces/movieInterface';
import {HelperService} from '../../service/helper/helper.service';
import {Constants} from '../../service/constants';
import {ChangeRatingComponent} from '../change-rating/change-rating.component';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.page.html',
    styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

    fav_movies_arr: Array<Movie> = [];
    isSorted = false;
    @ViewChild('slidingList') slidingList;

    constructor(public storageService: StorageService, public helperService: HelperService, private popoverController: PopoverController) {
    }

    ngOnInit() {
        if (this.helperService.favourites.size > 0) {
            this.helperService.favourites.forEach((value, key) => {
                this.fav_movies_arr.push(value);
            });
            this.fav_movies_arr.forEach(movie => {
                movie.rating = this.helperService.ratings.has(movie.imdb_id) ? this.helperService.ratings.get(movie.imdb_id).rating : undefined;
            });
            this.storageService.loadImages(this.fav_movies_arr, false);
        }
    }

    async deleteMovie(movie) {
        this.fav_movies_arr = this.helperService.arrayRemoveById(this.fav_movies_arr, movie);
        this.storageService.deleteMapEntry(movie, Constants.MOVIE_FAVOURITE);
        await this.slidingList.closeSlidingItems();
    }
    async changeRating(ev: any, star, movie) {
        const popover = await this.popoverController.create({
            component: ChangeRatingComponent,
            event: ev,
            translucent: true,
            componentProps: {rating: star}
        });

        popover.onDidDismiss().then(data => {
            if (data.data > 0) {
                movie.rating = data.data;
                this.storageService.addMovieToRating(movie);
               // this.storageService.addMovieToFavourites(movie);
            }
        });
        await this.slidingList.closeSlidingItems();
        return await popover.present();
    }
}
