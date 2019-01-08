import {Component, OnInit, ViewChild} from '@angular/core';
import {
    CompleteMovieSearchRequest,
    Movie,
    MovieHistory,
    MovieResult,
    PartialMovieSearchRequest,
    Poster
} from '../../interfaces/movieInterface';
import {StorageService} from '../../service/storage/storage.service';
import {ApiService} from '../../service/apicalls/api.service';
import {HelperService} from '../../service/helper/helper.service';
import {NavController} from '@ionic/angular';
import {Constants} from '../../service/constants';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

    slideOpts = {
        slidesPerView: 1.3,
        slidesPerColumn: 2
    };
    close_map: Map<string, string> = new Map<string, string>();
    currentDate;
    from_year;
    to_year;
    to_year_select;
    min = 2016;
    max = new Date().getFullYear().toString();
    filter_enabled = false;
    movieHistory: Array<MovieHistory> = [<MovieHistory>{
        timestamp: '',
        request: <CompleteMovieSearchRequest> {
            length: 0,
            data: <PartialMovieSearchRequest> {
                movies: [],
                keywords: [],
                actors: [],
                genres: [],
                timeperiod: []
            },
            entity: ''
        },
        result: <MovieResult> {result: []}
    }];
    @ViewChild('slidingList') slidingList;
    constructor(public storageService: StorageService, public helperService: HelperService,
                public navController: NavController) {

        this.currentDate = new Date();
        this.from_year = this.currentDate.toISOString();
        this.to_year = this.currentDate;
        this.to_year_select = this.currentDate.toISOString();

        // this.movieHistory.push(<MovieHistory>{
        //     timestamp: this.currentDate,
        //     request: <CompleteMovieSearchRequest> {
        //         length: 0,
        //         data: <PartialMovieSearchRequest> {
        //             movies: [],
        //             keywords: [],
        //             actors: [],
        //             genres: [],
        //             timeperiod: []
        //         },
        //         entity: ''
        //     },
        //     result: <MovieResult> {result: []}
        // });
        this.storageService.getStorageEntries(Constants.MOVIE_HISTORY).then(data => {
           if (data != undefined || data != null) {
               this.movieHistory = data;
               this.movieHistory.sort((b, a) => (new Date(a.timestamp) > new Date(b.timestamp)) ? 1 : ((new Date(b.timestamp) > new Date(a.timestamp)) ? -1 : 0));
               this.movieHistory.forEach(data => {
                    this.close_map[data.timestamp] = true;
                });
            }
        });
    }

    ngOnInit() {

    }

    openSelectedHistory(timestamp, result_movies) {

        if (this.close_map[timestamp]) {
            this.storageService.loadImages(result_movies);
        }
        this.close_map[timestamp] = !this.close_map[timestamp];
    }
    repeatRequest(request) {
        this.helperService.movie_request_to_pass = request;
        this.helperService.movie_request_refine = true;
        this.helperService.movie_from_history = true;
        this.navController.navigateForward('movie-query');
    }
    showRecommendation(result) {
        this.helperService.movie_from_history = true;
        this.helperService.movie_result_to_display = result;
        this.navController.navigateForward('movie-result');
    }

    setFilterData() {
        this.storageService.getHistoryByDate(this.from_year, this.to_year).then(data => {
            this.movieHistory = data;
            if (this.movieHistory != undefined || this.movieHistory != null) {
                this.movieHistory.sort((b, a) => (new Date(a.timestamp) > new Date(b.timestamp)) ? 1 : ((new Date(b.timestamp) > new Date(a.timestamp)) ? -1 : 0));
                this.movieHistory.forEach(data => {
                    this.close_map[data.timestamp] = true;
                });
            }
        })
    }
    createDate(dateObject) {
        if (typeof dateObject !== 'string') {
            let date = new Date(dateObject.year.value,dateObject.month.value - 1, dateObject.day.value);
            return date.toISOString();
        }
        return dateObject;
    }
    openFilter(){
        this.filter_enabled = !this.filter_enabled;
    }
    setDate(period) {
        this.currentDate = new Date();
        if (period == "week") this.currentDate.setDate(this.currentDate.getDate() - 7);
        if (period == "month") this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        if (period == "year") this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.to_year = this.currentDate.toISOString();

        if (period == "selected") {
            this.from_year = this.createDate(this.from_year);
            this.to_year = this.createDate(this.to_year_select);
        }
        this.filter_enabled = false;
        this.setFilterData();
    }
    async deleteHistoryEntry(history) {
        this.movieHistory = this.helperService.arrayRemoveByTimestamp(this.movieHistory, history);
        this.storageService.deleteEntry(history, Constants.MOVIE_HISTORY, true);
        await this.slidingList.closeSlidingItems();
    }
}
