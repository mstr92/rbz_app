import {Injectable} from '@angular/core';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {NavController} from '@ionic/angular';
import {HelperService} from '../helper/helper.service';
import {ApiService} from '../apicalls/api.service';
import {MovieResult} from '../../interfaces/movieInterface';
import {ResultparserService} from '../resultparser/resultparser.service';
import {Router, RouterState, Routes} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {


    constructor(private oneSignal: OneSignal, public navCtrl: NavController, private helperService: HelperService, private apiService: ApiService,
                private parser: ResultparserService, private routes:Router) {

    }

    initPushOneSignal() {
        this.oneSignal.startInit('c61624bb-71b9-442f-85aa-ce0ae06c4f51', 'ANDROID_ID');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe((data) => {
            this.apiService.getEngineResponse(data.payload.additionalData.id).then(res => {
                console.log("setting result")
                if (res.data.includes('ERROR CALCULATING RECOMMENDATIONS!')) {
                    this.helperService.result_calculation_failed = true;
                } else {
                    this.helperService.movie_result_to_display = <MovieResult>{
                        id: data.payload.additionalData.id,
                        result: this.parser.parseMovieResult(res.data,
                            new Date().toISOString(), data.payload.additionalData.id)
                    };
                    this.helperService.result_calculation_finished = true;
                }
                this.helperService.waiting_for_movie_result = false;

                if(this.routes.url == '/movie-result-waiting'){
                    this.helperService.setResultOnMoviePage.next();
                }
            });
        });
        this.oneSignal.handleNotificationOpened().subscribe((data) => {
            if (!this.helperService.result_calculation_finished) {
                console.log("setting result-button")
                this.apiService.getEngineResponse(data.notification.payload.additionalData.id).then(res => {
                    if (res.data.includes('ERROR CALCULATING RECOMMENDATIONS!')) {
                        this.helperService.result_calculation_failed = true;
                    } else {
                        this.helperService.movie_result_to_display = <MovieResult>{
                            id: data.notification.payload.additionalData.id,
                            result: this.parser.parseMovieResult(res.data,
                                new Date().toISOString(), data.notification.payload.additionalData.id)
                        };
                        this.helperService.result_calculation_finished = true;
                    }
                    this.helperService.waiting_for_movie_result = false;
                    this.navCtrl.navigateForward("/movie-result");
                });
            }
        });

        this.oneSignal.endInit();
        this.oneSignal.getIds().then(id => {
            this.helperService.oneSignalUserId = id.userId;
        });
    }

}
