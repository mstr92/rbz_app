import { Component, OnInit } from '@angular/core';
import {FavouritesService} from '../../service/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  constructor(public favService: FavouritesService) { }

  ngOnInit() {
  }

}
