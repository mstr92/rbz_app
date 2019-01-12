import {Injectable} from '@angular/core';
import {MovieResult, Movie, MovieHistory, EngineRequest} from '../../interfaces/movieInterface';
import {HelperService} from '../helper/helper.service';
import {StorageService} from '../storage/storage.service';
import {Constants} from '../constants';
import {ApiService} from '../apicalls/api.service';

@Injectable({
    providedIn: 'root'
})
export class ResultparserService {

    constructor(public helperService: HelperService,
                public storageService: StorageService, private apiService: ApiService) {
    }

    parseMovieResult(result, timestamp, result_id) {
        let parsedObject = JSON.parse(result);
        if (parsedObject.recommendation_list == undefined)
            parsedObject = JSON.parse(parsedObject);
        let movies: Array<Movie> = [];
        if (parsedObject != undefined) {
            parsedObject.recommendation_list.forEach((element) => {

                let movie: Movie = {
                    id: element.id,
                    imdb_id: element.ttid,
                    title: element.title.substring(0, element.title.length - 7),
                    year: element.year,
                    favourite: element.ttid in this.helperService.favourites,
                    rating: element.ttid in this.helperService.ratings ? this.helperService.ratings[element.ttid].rating : undefined
                };
                movies.push(movie);
            });
            if (movies.length > 0) {
                let history = <MovieHistory> {
                    timestamp: timestamp,
                    request: this.helperService.movie_request_to_pass,
                    result: <MovieResult>{id: result_id, result: movies, timestamp: timestamp}
                };
                this.storageService.addMovieHistory(history);
                return movies;
            } else {
                return null;
            }
        }
        return null;

    }

    buildRequestBody(search_data) {
        let body: EngineRequest = {length: search_data.length};
        if (search_data.data.movies != undefined) {
            search_data.data.movies.forEach(entry => {
                if (entry.alignment == Constants.NEGATIVE) {
                    if (body.neg_movie == undefined) body.neg_movie = [];
                    body.neg_movie.push(entry.title);
                }
                if (entry.alignment == Constants.POSITIVE) {
                    if (body.pos_movie == undefined) body.pos_movie = [];
                    body.pos_movie.push(entry.title);
                }
            });
        }
        if (search_data.data.keywords != undefined) {
            search_data.data.keywords.forEach(entry => {
                if (entry.alignment == Constants.NEGATIVE) {
                    if (body.neg_keyword == undefined) body.neg_keyword = [];
                    body.neg_keyword.push(entry.name);
                }
                if (entry.alignment == Constants.POSITIVE) {
                    if (body.pos_keyword == undefined) body.pos_keyword = [];
                    body.pos_keyword.push(entry.name);
                }
            });
        }
        if (search_data.data.genres != undefined) {
            search_data.data.genres.forEach(entry => {
                if (entry.alignment == Constants.NEGATIVE) {
                    if (body.neg_genre == undefined) body.neg_genre = [];
                    body.neg_genre.push(entry.name);
                }
                if (entry.alignment == Constants.POSITIVE) {
                    if (body.pos_genre == undefined) body.pos_genre = [];
                    body.pos_genre.push(entry.name);
                }
            });
        }
        if (search_data.data.actors != undefined) {
            search_data.data.actors.forEach(entry => {
                if (entry.alignment == Constants.NEGATIVE) {
                    if (body.neg_actor == undefined) body.neg_actor = [];
                    body.neg_actor.push(entry.firstname + ' ' + entry.lastname);
                }
                if (entry.alignment == Constants.POSITIVE) {
                    if (body.pos_actor == undefined) body.pos_actor = [];
                    body.pos_actor.push(entry.firstname + ' ' + entry.lastname);
                }
            });
        }
        if (search_data.data.timeperiod != undefined) {
            search_data.data.timeperiod.forEach(entry => {
                if (entry.alignment == Constants.NEGATIVE) {
                    if (body.neg_year_from == undefined) body.neg_year_from = [];
                    if (body.neg_year_to == undefined) body.neg_year_to = [];
                    body.neg_year_from.push(entry.from);
                    body.neg_year_to.push(entry.to);
                }
                if (entry.alignment == Constants.POSITIVE) {
                    if (body.pos_year_from == undefined) body.pos_year_from = [];
                    if (body.pos_year_to == undefined) body.pos_year_to = [];
                    body.pos_year_from.push(entry.from);
                    body.pos_year_to.push(entry.to);
                }
            });
        }
        return body;
    }

    sendRequestToEngine(search_data, show_more=false){
        console.log('Send Request to Engine..');
        const notificationId = show_more ? '0' : this.helperService.oneSignalUserId;
        return this.apiService.setEngineRequest(this.buildRequestBody(search_data), notificationId).then(data => {
            if (data.status == 201) {
                let dataObject = JSON.parse(data.data);
                if (dataObject.response.includes('ERROR CALCULATING RECOMMENDATIONS!')) {
                    this.helperService.result_calculation_failed = true;
                } else {
                    const time = new Date().toISOString();
                    this.helperService.movie_result_to_display = <MovieResult>{
                        id: dataObject.id,
                        timestamp: time,
                        result: this.parseMovieResult(dataObject.response, time, dataObject.id)
                    };
                    this.helperService.result_calculation_finished = true;
                }
                this.storageService.setMovieWait(false);
                if(!show_more) this.helperService.setResultOnMoviePage.next();
                return true;
            }
            return false;
        });
    }
}
