import {Component} from '@angular/core';
import {NavController} from '@ionic/angular';
import {HelperService} from '../../service/helper/helper.service';
import {MovieResult} from '../../interfaces/movieInterface';
import {ApiService} from '../../service/apicalls/api.service';
import {ResultparserService} from '../../service/resultparser/resultparser.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {

    constructor(public navCtrl: NavController, private helperService: HelperService, private apiService: ApiService, private parser: ResultparserService) {

    }

    goToMovies() {
        if (this.helperService.waiting_for_movie_result) {
            this.navCtrl.navigateForward('movie-result-waiting');
        } else if (this.helperService.result_calculation_finished) {
            this.navCtrl.navigateForward('movie-result');
        } else {
            this.navCtrl.navigateForward('movie-query');
        }
    }
}
