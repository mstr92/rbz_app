import {Component, OnInit, ViewChild} from '@angular/core';
import {Movie} from '../../interfaces/movieInterface';
import {StorageService} from '../../service/storage/storage.service';
import {HelperService} from '../../service/helper/helper.service';
import {PopoverController} from '@ionic/angular';
import {ChangeRatingComponent} from '../change-rating/change-rating.component';
import {Constants} from '../../service/constants';

interface Rating {
    stars5: Array<Movie>;
    stars4: Array<Movie>;
    stars3: Array<Movie>;
    stars2: Array<Movie>;
    stars1: Array<Movie>;
}

@Component({
    selector: 'app-ratings',
    templateUrl: './ratings.page.html',
    styleUrls: ['./ratings.page.scss'],
})

export class RatingsPage implements OnInit {
    indexlist = [5, 4, 3, 2, 1];
    rating: Rating = {stars5: [], stars4: [], stars3: [], stars2: [], stars1: []};
    constructor(public storageService: StorageService, public helperService: HelperService,
                public popoverController: PopoverController) {
    }

    @ViewChild('slidingList') slidingList;

    ngOnInit() {
        if (this.helperService.ratings.size > 0) {
            console.log(this.helperService.ratings)
            this.helperService.ratings.forEach((value,key) => {
                value.favourite = this.helperService.favourites.has(value.imdb_id);
                this.rating['stars' + value.rating.toString()].push(value);
            });
            for (let i = 1; i <= 5; i++) {
                this.storageService.loadImagesMap(this.rating['stars' + i.toString()]);
            }
        }
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
                this.rating['stars' + star] = this.helperService.arrayRemoveById(this.rating['stars' + star], movie);
                this.rating['stars' + data.data].push(movie);
                this.storageService.addMovieToRating(movie);
                this.storageService.addMovieToFavourites(movie, true);
            }
        });
        await this.slidingList.closeSlidingItems();
        return await popover.present();
    }

    async deleteMovie(movie, rating) {
        this.rating['stars' + rating] = this.helperService.arrayRemoveById(this.rating['stars' + rating], movie);
        this.storageService.deleteMapEntry(movie, Constants.MOVIE_RATING);
        await this.slidingList.closeSlidingItems();
    }
    addToFavourite(movie){
        this.storageService.addMovieToFavourites(movie);
       // this.storageService.addMovieToRating(movie, true);
        movie.favourite = !movie.favourite;
    }
}
