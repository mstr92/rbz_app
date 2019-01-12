import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {StorageService} from '../../service/storage/storage.service';
import {Constants} from '../../service/constants';
import {HelperService} from '../../service/helper/helper.service';
import {NotificationService} from '../../service/push/notification.service';
import {Movie} from '../../interfaces/movieInterface';


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

    constructor(public http: Http, public storageService: StorageService, public helperService: HelperService, public notificationService: NotificationService) {
    }

    ngOnInit() {
    }

    testPush() {
        this.storageService.initHistory();
    }

    setTest() {
       //  this.storageService.getUUID().then(data => console.log(data));
    }
    setTest1() {

    }
    getTest(imdb_id) {
        this.storageService.getStorageEntries(Constants.MOVIE_HISTORY).then(data => {
            console.log(data)
        })
    }
}
