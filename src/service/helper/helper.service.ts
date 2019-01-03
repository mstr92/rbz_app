import {Injectable} from '@angular/core';
import {CompleteMovieSearchRequest, Movie, Poster} from '../../interfaces/movieInterface';
import { Base64 } from '@ionic-native/base64/ngx';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    movie_request_to_pass: CompleteMovieSearchRequest;
    movie_request_refine = false;

    constructor(private base64: Base64) {
        this.movie_request_to_pass = {
            entity: '',
            data: {},
            length: 0
        };
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

    // https://staxmanade.com/2017/02/how-to-download-and-convert-an-image-to-base64-data-url/
    async getBase64ImageFromUrl(imageUrl) {
        let filePath: string = imageUrl;
        this.base64.encodeFile(filePath).then((base64File: string) => {
            console.log(base64File);
        }, (err) => {
            console.log(err);
        })
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
