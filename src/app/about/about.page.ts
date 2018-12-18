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
        // const id = 'tt1345836';
        // this.http.get('http://127.0.0.1:5000/movie/details1/' + id).subscribe(data => {
        //     const response = JSON.parse(data.text());
        //     console.log(response);
        // });
    }
    test1() {
        this.storageService.getAllMoviePosterByID().then(data => console.log(data));
    }
    test2() {
        this.storageService.initMovieHistory();
    }


}
