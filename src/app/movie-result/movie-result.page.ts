import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {MovieResult} from '../../interfaces/movieInterface';
import {ResultparserService} from '../../service/resultparser/resultparser.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {HelperService} from '../../service/helper/helper.service';
import {NavController} from '@ionic/angular';
import {Constants} from '../../service/constants';
import {ApiService} from '../../service/apicalls/api.service';
import {Device} from '@ionic-native/device/ngx';
import {NotificationService} from '../../service/push/notification.service';

@Component({
    selector: 'app-movie-result',
    templateUrl: './movie-result.page.html',
    styleUrls: ['./movie-result.page.scss'],
})
export class MovieResultPage implements OnInit, OnDestroy, AfterViewChecked {
    movies: MovieResult;
    movie_tmp = [];
    movie_vote_map: Map<string, boolean> = new Map<string, boolean>();
    rec_text = ['GREAT', 'GOOD', 'OKEY', 'BAD', 'HORRIBLE'];
    init_flag= false;

    constructor(public storageService: StorageService, public parser: ResultparserService, public  socialSharing: SocialSharing,
                public helperService: HelperService, public navCtrl: NavController, private apiService: ApiService, private device: Device,
                private notificationService: NotificationService) {
        this.movies = {id: 0, result: [], timestamp: ''};
        this.helperService.setResultOnMoviePage.subscribe(() => {
            this.setData();
        });
    }

    ngOnInit() {
        this.setData();
    }

    ngAfterViewChecked() {
        if (!this.init_flag) {
            if (this.helperService.movie_from_history) {
                this.movies.result.forEach(movie => {
                    movie.favourite = this.helperService.favourites.has(movie.imdb_id);
                    movie.rating = this.helperService.ratings.has(movie.imdb_id) ? this.helperService.ratings.get(movie.imdb_id).rating : undefined;
                    if (movie.vote != undefined) {
                        this.displayRecommendationVote(movie.vote, movie);
                    }
                });

            } else {
                if(this.movies.result != null)
                    this.storageService.loadImages(this.movies.result);
            }
            this.init_flag = true;
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
        console.log('Set Data!!');
        console.log(this.helperService.movie_result_to_display);
        this.movies = this.helperService.movie_result_to_display;
        if (this.movies != null) {
            // if (!this.helperService.movie_from_history) {
                // this.storageService.loadImages(this.movies.result);
            // }
            this.movies.result.forEach(movie => {
                this.movie_vote_map[movie.id] = movie.vote == undefined;
            });
        }
    }

    showMore() {
        this.storageService.setMovieShowMore(true);
        this.helperService.movie_request_to_pass.length += 5;
        this.notificationService.enableNotification(true);
        this.parser.sendRequestToEngineShowMore(this.helperService.movie_request_to_pass, this.movies.timestamp).then(isDataSet => {
            if (isDataSet)
                this.setData();
        });
    }

    cancelShowMore() {
        this.notificationService.enableNotification(false);
        this.storageService.setMovieShowMore(false);
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
            this.storageService.addMovieToRating(movie, true);
        }
        //Hack to refresh Page after click
        movie.favourite = !movie.favourite;
        document.getElementById('poster' + movie.id).click();
    }

    //----------------------------------
    // Rating
    //----------------------------------
    setRating(rating, movie) {
        movie.rating = rating;
        this.storageService.addMovieToRating(movie);
        this.storageService.addMovieToFavourites(movie, true);
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
            this.storageService.setMovieHistoryDetails(movie, this.movies.timestamp);
        });
    }

    changeVote(movie) {
        let vote_text = document.getElementById('vote_res' + movie.id) as HTMLDivElement;
        let vote_change = document.getElementById('vote_change' + movie.id) as HTMLDivElement;

        this.movie_vote_map[movie.id] = false;
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
        console.log('Display Recommendation');
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
    openFullPoster() {
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

    trackByFct(index, item) {
        return index;
    }

}
