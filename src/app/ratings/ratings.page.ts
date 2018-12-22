import {Component, OnInit, ViewChild} from '@angular/core';
import {Movie, Poster} from '../../interfaces/movieInterface';
import {StorageService} from '../../service/storage/storage.service';
import {HelperService} from '../../service/helper/helper.service';
import {ApiService} from '../../service/apicalls/api.service';
import {PopoverController} from '@ionic/angular';
import {ChangeRatingComponent} from '../change-rating/change-rating.component';

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
    indexlist = [5,4,3,2,1];
    rating: Rating = {stars5: [], stars4: [],stars3: [],stars2: [],stars1: []};
    constructor(public storageService: StorageService, public helperService: HelperService, public apiService:ApiService,
                public popoverController: PopoverController) {
        this.storageService.getMovieRatings().then(data => {
            if (data!= undefined || data!= null) {
                data.forEach(movie => {
                    this.rating["stars" + movie.rating.toString()].push(movie);
                });
                for(let i = 1; i <= 5; i++) {
                   this.loadImages(this.rating["stars" +i.toString()]);
                }
            }
        });
    }
    @ViewChild('slidingList') slidingList;
    ngOnInit() {
    }

    async changeRating (ev: any, star, movie) {
        const popover = await this.popoverController.create({
            component: ChangeRatingComponent,
            event: ev,
            translucent: true,
            componentProps: {rating: star}
        });
        popover.onDidDismiss().then(data => {
            if(data.data > 0) {
                movie.rating = data.data;
                this.rating["stars"+star] = this.helperService.arrayRemoveById(this.rating["stars"+star], movie);
                this.rating["stars"+data.data].push(movie);
                this.storageService.addMovieRating(movie);
            }
        });
        await this.slidingList.closeSlidingItems();
        return await popover.present();
    }

    async deleteMovie(movie, rating) {
        this.rating["stars" + rating] = this.helperService.arrayRemoveById(this.rating["stars" + rating], movie);
        this.storageService.deleteRating(movie);
        await this.slidingList.closeSlidingItems();
    }

    loadImages(movie_arr) {
        movie_arr.forEach(movie => {
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
