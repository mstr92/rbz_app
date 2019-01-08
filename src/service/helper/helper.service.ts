import {Injectable} from '@angular/core';
import {CompleteMovieSearchRequest, Movie, MovieResult, Poster} from '../../interfaces/movieInterface';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    movie_request_to_pass: CompleteMovieSearchRequest;
    movie_request_refine = false;
    isUserLoggedIn;
    username;
    movie_result_to_display: MovieResult;
    movie_from_history = false;

    constructor() {
        this.movie_request_to_pass = {entity: '', data: {}, length: 0};
        this.movie_result_to_display = {id: 0, result: []}
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

    // https://forum.ionicframework.com/t/need-to-convert-image-url-to-base64-string/74449/2
    convertToDataURLviaCanvas(url, outputFormat){
        return new Promise( (resolve, reject) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
                    ctx = canvas.getContext('2d'),
                    dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                //callback(dataURL);
                canvas = null;
                resolve(dataURL);
            };
            img.src = url;
        });
    }
}
