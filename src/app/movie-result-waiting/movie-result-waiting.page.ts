import { Component, OnInit } from '@angular/core';
import {ResultparserService} from '../../service/resultparser/resultparser.service';
import {HelperService} from '../../service/helper/helper.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-movie-result-waiting',
  templateUrl: './movie-result-waiting.page.html',
  styleUrls: ['./movie-result-waiting.page.scss'],
})
export class MovieResultWaitingPage implements OnInit {

  constructor(private parser:ResultparserService, private helperService:HelperService, private navController: NavController) {
      this.parser.buildRequestBody(this.helperService.movie_request_to_pass);
      this.helperService.setResultOnMoviePage.subscribe(() => {
          this.navController.navigateForward('/movie-result')
      });
  }

  ngOnInit() {
  }
}
