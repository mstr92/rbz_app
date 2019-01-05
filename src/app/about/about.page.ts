import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {StorageService} from '../../service/storage/storage.service';
import {Constants} from '../../service/constants';
import {HelperService} from '../../service/helper/helper.service';


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

    constructor(public http: Http, public storageService: StorageService, public helperService: HelperService) {
    }

    ngOnInit() {
    }

    test() {
        console.log(this.storageService.getStorageEntries(Constants.MOVIE_POSTER));

    }

    test1() {

    }

    test2() {

    }

    test3() {
        this.http.get('http://129.27.153.16:8008/api/rbz/movies/test').subscribe(data => {
                const response = JSON.parse(data.text());
                console.log(response);
            },
            error => {
                console.log(error);
            }
        );
    }

    test4() {

        let a = document.getElementById('img') as HTMLImageElement;
        this.storageService.getMoviePosterByID('tt1345836').then(b => a.src = b);
    }

    test5() {
        console.log(this.helperService.isUserLoggedIn)
        console.log(this.helperService.username)

    }

    test6() {
        this.storageService.getUUID().then(is_set => {
            console.log(is_set.data)
        });
    }


}
