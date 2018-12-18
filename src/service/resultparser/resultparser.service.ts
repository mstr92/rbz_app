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
            let actors: Array<Actor> = [];

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
                // this.http.get('http://127.0.0.1:5000/movie/details/' + imdb_id_extracted).subscribe(data => {
                //     const response = JSON.parse(data.text());
                let movie: Movie = {
                    id: id_extracted,
                    imdb_id: imdb_id_extracted,
                    title: title_extracted,
                    image: '',//response.poster,
                    //actors: response.actors,
                    year: year_extracted,
                    favourite: false,
                };


                this.storageService.isInPosterStorage(imdb_id_extracted).then(is_in_storage => {
                    // If img in storage:
                    if (is_in_storage) {
                        console.log('was in storage: ' + imdb_id_extracted);
                        this.storageService.getMoviePosterByID(imdb_id_extracted).then(data => movie.image = data.poster);
                    }
                    else {
                        //TODO: change to rbz.io API call
                        // else: get image from url and store in storage
                        this.apiService.getDetailedMovieInfo1(imdb_id_extracted).then(data => {
                            let dataObj: any = JSON.parse(data.data);
                            const url = 'https://image.tmdb.org/t/p/w300/'; //statt w185 -> original
                            const poster = dataObj.movie_results[0].poster_path;
                            this.helperService.convertToDataURLviaCanvas(url + poster, 'image/jpeg')
                                .then(base64Img => {
                                    movie.image = base64Img.toString();
                                    this.storageService.addMoviePoster(<Poster>{imdb_id: imdb_id_extracted, poster: base64Img.toString()});
                                });

                        });
                    }
                });
                movies.push(movie);
            }


            // this.http.get('http://127.0.0.1:5000/movie/poster/' + search_string).subscribe(data => {
            //     const dataJson = data.json();
            //     dataJson.forEach(element => {
            //         let obj = movies.find(obj => obj.imdb_id == element.movie_id);
            //         obj.image = element.imglink;
            //     });
            // });
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
