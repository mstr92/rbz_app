import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {StorageService} from '../../service/storage/storage.service';
import {Constants} from '../../service/constants';

@Component({
    selector: 'app-tour',
    templateUrl: './tour.page.html',
    styleUrls: ['./tour.page.scss'],
})
export class TourPage implements OnInit {

    notShowAgain = false;
    constructor(private navCtrl: NavController, private storageService: StorageService) {
    }

    ngOnInit() {
        this.storageService.getStorageEntries(Constants.NOT_SHOW_INTRO).then(data => {
            this.notShowAgain = data;
        })
    }

    skip() {
        this.storageService.setIntro(this.notShowAgain);
        this.navCtrl.navigateRoot('home');
    }
}
