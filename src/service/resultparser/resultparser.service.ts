import {Injectable, ViewChild} from '@angular/core';
import {MovieResult, Movie, Genre, Actor, Poster, MovieHistory} from '../../interfaces/movieInterface';
import {Http} from '@angular/http';
import {HelperService} from '../helper/helper.service';
import {ApiService} from '../apicalls/api.service';
import {StorageService} from '../storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class ResultparserService {

    constructor(public http: Http, public helperService: HelperService, public apiService: ApiService,
                public storageService: StorageService) {
    }

    parseMovieResult(result, timestamp) {
        const res = [];
        let search_string = '';
        const year = result.match(/u'year': \d{4}/g);
        const title = result.match(/u'title': u'(.*?)'/g);
        const imdb_id = result.match(/u'ttid': u'tt\d+'/g);
        const id = result.match(/u'id': \d+L/g);

        if (year.length == title.length && imdb_id.length == title.length && id.length == title.length) {
            let movies: Array<Movie> = [];

            for (let i = 0; i < year.length; i++) {
                const imdb_id_extracted = imdb_id[i].split(/'/)[3];
                const title_prefetch = title[i].split(/'/)[3];
                const title_extracted = title_prefetch.substring(0, title_prefetch.length - 7);
                const year_extracted = year[i].split(/': /)[1];
                const id_prefetch = id[i].split(/': /)[1];
                const id_extracted = id_prefetch.substring(0, id_prefetch.length - 1);

                if (i == year.length - 1) {
                    search_string += 'movie_id = \'' + imdb_id_extracted + '\'';
                } else {
                    search_string += 'movie_id = \'' + imdb_id_extracted + '\' OR ';
                }
                let movie: Movie = {
                    id: id_extracted,
                    imdb_id: imdb_id_extracted,
                    title: title_extracted,
                    image: '',
                    year: year_extracted,
                    favourite: false,
                };
                movies.push(movie);
            }

            let history = <MovieHistory> {
                timestamp: timestamp,
                request: this.helperService.movie_request_to_pass,
                result: <MovieResult>{result: movies}
            };

            this.storageService.addMovieHistory(history);
            return movies;
        } else {
            return null;
        }
    }
}
