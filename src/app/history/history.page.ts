import {Component, OnInit} from '@angular/core';
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

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

    slideOpts = {
        slidesPerView: 1.5,
        slidesPerColumn: 2
    };
    movieHistory: Array<MovieHistory> = [<MovieHistory>{
        timestamp: "",
        request: <CompleteMovieSearchRequest> {
            length: 0,
            data: <PartialMovieSearchRequest> {
                movies: [],
                keywords: [],
                actors: [],
                genres: [],
                timeperiod: []
            },
            entity: ""
        },
        result: <MovieResult> {result: []}
    }];
    constructor(public storageService: StorageService, public apiService: ApiService, public helperService: HelperService) {
        this.storageService.getHistory().then(data => {
            this.movieHistory = data;

            this.movieHistory.forEach(data => {
                data.result.result.forEach(movie => {
                    if(movie.image == "") {
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

                })
            })

            console.log(data)
        })
    }

    ngOnInit() {

    }



}
