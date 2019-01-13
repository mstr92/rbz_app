import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CompleteMovieSearchRequest, MovieHistory, MovieResult, PartialMovieSearchRequest} from '../../interfaces/movieInterface';
import {StorageService} from '../../service/storage/storage.service';
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
    from_year_select;
    to_year;
    to_year_select;
    min = 2016;
    max = new Date().getFullYear().toString();
    filter_enabled = false;
    movieHistoryArray: Array<MovieHistory> = [];
    total_history_entries = 0;
    show_entries_size = 10;
    disableShowMore = false;
    @ViewChild('slidingList') slidingList;

    constructor(public storageService: StorageService, public helperService: HelperService,
                public navController: NavController) {
        this.currentDate = new Date();

        this.from_year = this.currentDate;
        this.to_year = this.currentDate;

        this.to_year_select = this.currentDate.toISOString();
        this.from_year_select = this.currentDate.toISOString();
    }

    ngOnInit() {
        this.setData(this.show_entries_size);
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
        this.navController.navigateRoot('movie-query');
    }

    showRecommendation(result) {
        this.helperService.movie_from_history = true;
        this.helperService.movie_result_to_display = result;
        this.navController.navigateRoot('movie-result');
    }


    createDate(dateObject) {
        if (typeof dateObject !== 'string') {
            let date = new Date(dateObject.year.value, dateObject.month.value - 1, dateObject.day.value);
            return date.toISOString();
        }
        return dateObject;
    }

    openFilter() {
        this.filter_enabled = !this.filter_enabled;
    }

    setDate(period) {
        this.currentDate = new Date();

        this.from_year = this.currentDate.toISOString();
        if (period == 'week') this.currentDate.setDate(this.currentDate.getDate() - 7);
        if (period == 'month') this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        if (period == 'year') this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.to_year = this.currentDate.toISOString();

        if (period == 'selected') {
            this.from_year = this.createDate(this.from_year_select);
            this.to_year = this.createDate(this.to_year_select);
        }
        this.filter_enabled = false;
        this.setFilterData();
    }

    async deleteHistoryEntry(history) {
        this.movieHistoryArray = this.helperService.arrayRemoveByTimestamp(this.movieHistoryArray, history);
        this.storageService.deleteEntry(history, Constants.MOVIE_HISTORY);
        this.show_entries_size = this.show_entries_size - 1;
        this.total_history_entries = this.total_history_entries - 1;
        await this.slidingList.closeSlidingItems();
    }

    trackById(index, item) {
        return index;
    }

    showMore() {
        this.show_entries_size = this.show_entries_size + 10;
        if (this.show_entries_size >= this.total_history_entries) {
            this.show_entries_size = this.total_history_entries;
            this.disableShowMore = true;
        }
        this.setData(this.show_entries_size);
    }

    setData(size, filter = false, date = null) {
        this.storageService.getHistoryEntries(size, filter, date).then(data => {
            if (data.total_length > 0) {
                console.log(data);
                if (data.total_length <= this.show_entries_size) {
                    this.disableShowMore = true;
                    this.show_entries_size = data.total_length;
                } else {
                    this.disableShowMore = false;
                }

                this.total_history_entries = data.total_length;
                this.movieHistoryArray = data.data_arr;
                this.movieHistoryArray.forEach(entry => {
                    this.close_map[entry.timestamp] = true;
                });
                this.movieHistoryArray.sort((b, a) => (new Date(a.timestamp) > new Date(b.timestamp)) ? 1 : ((new Date(b.timestamp) > new Date(a.timestamp)) ? -1 : 0));
            } else {
                this.movieHistoryArray = [];
                this.show_entries_size = 0;
                this.total_history_entries = 0;
                this.disableShowMore = true;
            }
        }, error => console.log(error));
    }

    setFilterData() {
        this.show_entries_size = 10;
        this.setData(this.show_entries_size, true, {from: this.from_year, to: this.to_year});
    }
}
