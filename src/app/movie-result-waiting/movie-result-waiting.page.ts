import {Component, OnInit} from '@angular/core';
import {ResultparserService} from '../../service/resultparser/resultparser.service';
import {HelperService} from '../../service/helper/helper.service';
import {NavController} from '@ionic/angular';
import {StorageService} from '../../service/storage/storage.service';
import {NotificationService} from '../../service/push/notification.service';

@Component({
    selector: 'app-movie-result-waiting',
    templateUrl: './movie-result-waiting.page.html',
    styleUrls: ['./movie-result-waiting.page.scss'],
})
export class MovieResultWaitingPage implements OnInit {

    constructor(private parser: ResultparserService, private helperService: HelperService,
                private navController: NavController, private storageService: StorageService,
                public notificationService:NotificationService) {
        if (!this.helperService.waiting_for_movie_result) {
            this.parser.sendRequestToEngine(this.helperService.movie_request_to_pass);
            this.notificationService.enableNotification(true);
            this.storageService.setMovieWait(true);
        }
        this.helperService.setResultOnMovieWaitingPage.subscribe(() => {
            this.navController.navigateRoot('/movie-result');
        });
    }

    ngOnInit() {
    }

    cancel(){
        this.notificationService.enableNotification(false);
        this.storageService.setMovieWait(false);
        this.navController.navigateRoot('/home');
    }
}
