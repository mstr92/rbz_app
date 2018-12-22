import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {StorageService} from '../../service/storage/storage.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

    constructor(public http: Http, public storageService: StorageService) {
    }

    ngOnInit() {
    }

    test() {
        this.storageService.initMoviePosters();

    }
    test1() {
        this.storageService.getAllMoviePosterByID().then(data => console.log(data));
    }
    test2() {
        this.storageService.initMovieHistory();
    }
    test3() {
        this.http.get('http://129.27.153.16:8008/api/rbz/movies/test').subscribe(data => {
            const response = JSON.parse(data.text());
            console.log(response);
        },
            error => {console.log(error)}
            )
    }
    test4() {

        let a = document.getElementById("img") as HTMLImageElement;
        this.storageService.getMoviePosterByID("tt1345836").then(b => a.src = b);
    }
    test5() {
        this.storageService.initMovieRating();
    }


}
