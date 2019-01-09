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
            if (this.helperService.result_calculation_finished) {
                this.helperService.result_calculation_finished = false;
                this.apiService.getEngineResponse(this.helperService.movie_result_id).then(res => {
                    this.helperService.movie_result_to_display = <MovieResult>{
                        id: this.helperService.movie_result_id,
                        result: this.parser.parseMovieResult(res.data.substring(1, res.data.length - 2),
                            new Date().toISOString(), this.helperService.movie_result_id)
                    };
                    this.helperService.waiting_for_movie_result = false;
                    this.navCtrl.navigateForward('movie-result');
                });
            }
            else {
                this.navCtrl.navigateForward('movie-result');
            }
        } else {
            this.navCtrl.navigateForward('movie-query');
        }
    }
}
