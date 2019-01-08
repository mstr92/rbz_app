import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {StorageService} from '../../service/storage/storage.service';
import {Constants} from '../../service/constants';
import {HelperService} from '../../service/helper/helper.service';
import {NotificationService} from '../../service/push/notification.service';


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
       this.notificationService.initPushOneSignal();
    }

}
