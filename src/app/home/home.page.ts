import {Component} from '@angular/core';
import {NavController} from '@ionic/angular';
import {HelperService} from '../../service/helper/helper.service';
import {ConstantsService} from '../../service/constants/constants.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage{

    constructor(public navCtrl: NavController, public helperService: HelperService, public constantsService:ConstantsService) {
    }

    goToMovies() {
        if (this.helperService.waiting_for_movie_result) {
            this.navCtrl.navigateRoot('movie-result-waiting');
        } else if (this.helperService.result_calculation_finished) {
            this.navCtrl.navigateRoot('movie-result');
        } else if (this.helperService.result_show_more) {
            this.navCtrl.navigateRoot('movie-result');
        } else {
            this.navCtrl.navigateRoot('movie-query');
        }
    }
}
