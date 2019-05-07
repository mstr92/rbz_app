import {Injectable} from '@angular/core';
import {CompleteMovieSearchRequest, Movie, MovieResult} from '../../interfaces/movieInterface';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    favourites = new Map<string, Movie>();
    ratings =  new Map<string, Movie>();
    // Current movie reuquest object for refining oder history
    movie_request_to_pass: CompleteMovieSearchRequest;
    movie_request_refine = false;
    // Check if a user is logged in, flag + username
    isUserLoggedIn : boolean;
    username : string;
    //Data to display on Result Page
    movie_result_to_display: MovieResult;
    //True, if comming from history page
    movie_from_history = false;
    waiting_for_movie_result = false;
    result_calculation_finished = false;
    result_calculation_failed = false;
    result_show_more = false;
    // One Signal User id
    oneSignalUserId = '';

    setResultOnMoviePage: Subject<boolean> = new Subject<boolean>();
    setResultOnMovieWaitingPage: Subject<boolean> = new Subject<boolean>();


    constructor() {
        this.movie_request_to_pass = {entity: '', data: {}, length: 0};
        this.movie_result_to_display = {id: 0, result: [], timestamp: ''};
        this.setResultOnMoviePage.subscribe(() => {});
        this.setResultOnMovieWaitingPage.subscribe(() => {});
    }


    arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }

    arrayRemoveById(arr, value) {
        return arr.filter(function (ele) {
            return ele.id !== value.id;
        });
    }

    arrayRemoveByTimestamp(arr, value) {
        return arr.filter(function (ele) {
            return ele.timestamp !== value.timestamp;
        });
    }
}
