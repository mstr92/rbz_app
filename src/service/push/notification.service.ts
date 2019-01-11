import {Injectable} from '@angular/core';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {NavController} from '@ionic/angular';
import {HelperService} from '../helper/helper.service';
import {ApiService} from '../apicalls/api.service';
import {MovieResult} from '../../interfaces/movieInterface';
import {ResultparserService} from '../resultparser/resultparser.service';
import {Router} from '@angular/router';
import {Constants} from '../constants';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {


    constructor(private oneSignal: OneSignal, public navCtrl: NavController, private helperService: HelperService, private apiService: ApiService,
                private parser: ResultparserService, private router: Router) {

    }

    initPushOneSignal() {
        this.oneSignal.startInit(Constants.ONESIGNAL_APP_ID, 'ANDROID_ID');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe((data) => {
            this.getResultData(data.payload.additionalData, false);
        });
        this.oneSignal.handleNotificationOpened().subscribe((data) => {
            if (!this.helperService.result_calculation_finished) {
                this.getResultData(data.notification.payload.additionalData, true);
            }
            if (this.router.url == '/home') {
                //Hack to refresh Page after click
                document.getElementById("refresh_page").click();
            }

        });
        this.oneSignal.endInit();
        this.oneSignal.getIds().then(id => {
            this.helperService.oneSignalUserId = id.userId;
        });
    }

    getResultData(data, from_openNotification) {
        this.apiService.getEngineResponse(data.id).then(res => {
            if (res.data.includes(Constants.ENGINE_ERROR)) {
                this.helperService.result_calculation_failed = true;
            } else {
                let date = new Date().toISOString()
                this.helperService.movie_result_to_display = <MovieResult>{
                    id: data.id,
                    timestamp: date,
                    result: this.parser.parseMovieResult(res.data, date, data.id)
                };
                this.helperService.result_calculation_finished = true;
            }
            this.helperService.waiting_for_movie_result = false;

            if (from_openNotification) {
                this.navCtrl.navigateForward('/movie-result');
            } else {
                if (this.router.url == '/movie-result-waiting') {
                    this.helperService.setResultOnMoviePage.next();
                }
            }
        });
    }
}

