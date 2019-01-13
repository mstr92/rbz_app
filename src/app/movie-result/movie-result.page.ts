import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit, ViewChild,
} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {MovieResult} from '../../interfaces/movieInterface';
import {ResultparserService} from '../../service/resultparser/resultparser.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {HelperService} from '../../service/helper/helper.service';
import {NavController} from '@ionic/angular';
import {Constants} from '../../service/constants';
import {ApiService} from '../../service/apicalls/api.service';
import {Device} from '@ionic-native/device/ngx';

@Component({
    selector: 'app-movie-result',
    templateUrl: './movie-result.page.html',
    styleUrls: ['./movie-result.page.scss'],
})
export class MovieResultPage implements OnInit, OnDestroy, AfterViewInit {
    movies: MovieResult;
    movie_tmp = [];
    movie_rec_rating_map: Map<string, boolean> = new Map<string, boolean>();
    show_more = true;
    no_more_results = false;
    rec_text = ['GREAT', 'GOOD', 'OKEY', 'BAD', 'HORRIBLE'];
    show_more_counter = 0;
    constructor(public storageService: StorageService, public parser: ResultparserService, public  socialSharing: SocialSharing,
                public helperService: HelperService, public navCtrl: NavController, private apiService: ApiService, private device: Device) {
        this.movies = {id: 0, result: [], timestamp: ''};
    }

    ngOnInit() {
        this.setData();
    }

    ngAfterViewInit() {
        if (this.helperService.movie_from_history) {
            this.movies.result.forEach(movie => {
                movie.favourite = movie.imdb_id in this.helperService.favourites;
                movie.rating = movie.imdb_id in this.helperService.ratings ? this.helperService.ratings[movie.imdb_id].rating : undefined;

                if (!movie.rating != undefined) {
                    this.displayRecommendationVote(movie.vote, movie);
                }
            });
        }
    }
    ngOnDestroy() {
        console.log('destroy page');
        this.helperService.movie_from_history = false;
        this.helperService.result_calculation_failed = false;
        this.helperService.result_calculation_finished = false;
    }
    //----------------------------------
    // Set Data
    //----------------------------------
    setData() {
        this.movies = this.helperService.movie_result_to_display;
        this.storageService.loadImages(this.movies.result);
        this.movies.result.forEach(movie => {
            this.movie_rec_rating_map[movie.id] = movie.vote == undefined;
        });
    }
    showMore() {
        // if (this.show_more_counter == 2) {
        //     this.no_more_results = true;
        // } else {
        //     this.show_more = !this.show_more;
        //     this.show_more_counter = this.show_more_counter + 1;
        //     this.helperService.movie_request_to_pass.length += 5;
        //
        //     this.parser.sendRequestToEngine(this.helperService.movie_request_to_pass, true).then(isDataSet => {
        //         if(isDataSet)
        //             this.setData();
        //     });
        // this.show_more = !this.show_more;
            // ---OLD
            // more_movies.forEach(mmovie => {
            //     let in_arr = false;
            //     this.movies.result.forEach((cmovie, index) => {
            //         if (mmovie.id === cmovie.id) in_arr = true;
            //         if (index === this.movies.result.length - 1 && !in_arr) {
            //             this.movies.result.push(mmovie);
            //             this.movie_rec_rating_map[mmovie.id] = true;
            //         }
            //     });
            // });
            // this.helperService.movie_request_to_pass.length += 5;
            // this.storageService.loadImages(this.movies.result);

        // }

    }
    //----------------------------------
    // Settings
    //----------------------------------
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
    //----------------------------------
    // Favourites
    //----------------------------------
    addToFavourite(movie) {
        if (movie.favourite) {
            this.storageService.deleteMapEntry(movie, Constants.MOVIE_FAVOURITE);
        } else {
            this.storageService.addMovieToFavourites(movie);
        }
        movie.favourite = !movie.favourite;
    }
    //----------------------------------
    // Rating
    //----------------------------------
    setRating(rating, movie) {
        movie.rating = rating;
        this.storageService.addMovieToRating(movie);
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
    //----------------------------------
    // Vote
    //----------------------------------
    setRecommendationVote(vote, movie) {
        this.apiService.setVote(this.device.uuid, this.helperService.username, Number(this.movies.id), movie.id, vote).then(() => {
            this.displayRecommendationVote(vote, movie);
            console.log("change vote")
            console.log(this.movies.timestamp)
            console.log(movie)
            this.storageService.setMovieHistoryDetails(movie, this.movies.timestamp);
        });
    }
    changeVote(movie) {
        let vote_text = document.getElementById('vote_res' + movie.id) as HTMLDivElement;
        let vote_change = document.getElementById('vote_change' + movie.id) as HTMLDivElement;

        this.movie_rec_rating_map[movie.id] = false;
        for (let i = 1; i <= 5; i++) {
            let img_id = 'recrating' + i.toString() + 'img' + movie.id.toString();
            let img = document.getElementById(img_id) as HTMLImageElement;
            img.src = i == movie.vote ? '../../assets/image/rating/' + i.toString() + '_full.svg' : '../../assets/image/rating/' + i.toString() + '_line.svg';
            img.className = ' emoji visible pos-' + i.toString();
        }
        vote_text.className = 'vote-text invisible';
        vote_change.className = 'vote-change invisible';
    }
    displayRecommendationVote(vote, movie) {
        let vote_text = document.getElementById('vote_res' + movie.id) as HTMLDivElement;
        let text = 'The recommendation was ' + this.rec_text[vote - 1] + '!';
        let vote_change = document.getElementById('vote_change' + movie.id) as HTMLDivElement;

        for (let i = 1; i <= 5; i++) {
            let img_id = 'recrating' + i.toString() + 'img' + movie.id.toString();
            let img = document.getElementById(img_id) as HTMLImageElement;
            img.src = i == vote ? '../../assets/image/rating/' + i.toString() + '_full.svg' : '../../assets/image/rating/' + i.toString() + '_line.svg';
            if (i == vote) img.className += ' animate-' + i.toString();
            else img.className = 'emoji invisible pos-' + i.toString();
        }
        vote_text.innerText = text;
        vote_text.className = 'vote-text visible';
        vote_change.className = 'vote-change visible';

        movie.vote = vote;
    }
    //----------------------------------
    // Show details
    //----------------------------------
    openFullPoster(event) {
        event.srcElement.className = event.srcElement.className === 'poster small' ? 'poster full' : 'poster small';
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

}
