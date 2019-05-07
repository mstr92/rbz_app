import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {ConstantsService} from '../../service/constants/constants.service';


@Component({
  selector: 'app-change-rating',
  templateUrl: './change-rating.component.html',
  styleUrls: ['./change-rating.component.scss']
})
export class ChangeRatingComponent implements OnInit {
  rating = 0;
  constructor(public navParams:NavParams, public popoverController:PopoverController, public constantsService: ConstantsService) {
    this.rating = this.navParams.get('rating');
  }

  ngOnInit() {
  }

  rate(rating) {
    this.rating = rating;
  }
  cancel() {
    this.popoverController.dismiss(0);
  }
  save() {
    this.popoverController.dismiss(this.rating);
  }
  }
