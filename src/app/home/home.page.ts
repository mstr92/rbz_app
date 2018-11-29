import { Component } from '@angular/core';
import {NavController} from '@ionic/angular';
import {trigger, state, style, animate, transition, query} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  goToMovies() {
    this.navCtrl.navigateForward('movie-query');
  }
}
