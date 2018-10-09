import {Component, OnInit, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MovieSearchPage } from '../movie-search/movie-search.page';

@Component({
  selector: 'app-movie-detail-search',
  templateUrl: './movie-detail-search.page.html',
  styleUrls: ['./movie-detail-search.page.scss'],
})
export class MovieDetailSearchPage implements OnInit {

  icon_maxmin_visible: any;
  search_data: any;
  movie_year_enabled: any = {
      positive: false,
      negative: false
  };
  year_pos:  any = {
    upper: 2020,
    lower: 1960
  };
  year_neg:  any = {
        upper: 2020,
        lower: 1960
    };

  @ViewChild('slidingList') slidingList;

  constructor(public modalCtrl: ModalController) {
      this.icon_maxmin_visible = {movie: true, year: true};
  }

  ngOnInit() {
     this.search_data = {
            movie_pos:
                {
                  data: [
                      { name: 'Lord of the Rings 1', img: 'img1.jpg' },
                      { name: 'Lord of the Rings 2', img: 'img2.jpg' }
                  ],
                },
            movie_neg:  {
                data: [
                    {name: 'Lord of the Rings 3', img: 'img3.jpg' }
                ],
            },
      };
  }
   async moveToFirst() {
        const modal = await this.modalCtrl.create({
            component:  MovieSearchPage
        });
        return await modal.present();
    }

  minmaxCardContent(entity) {
     const min_view = document.getElementById('card_' + entity + '_min_view');
     const max_view = document.getElementById('card_' + entity + '_max_view');

     if (this.icon_maxmin_visible[entity]) {
       this.icon_maxmin_visible[entity] = false;
       max_view.className = 'content-min-view';
       min_view.className = 'content-max-view';
     } else {
       this.icon_maxmin_visible[entity] = true;
       max_view.className = 'content-max-view';
       min_view.className = 'content-min-view';
     }
  }

  async changeToPosOrNeg(entry, toPositive, entity) {
        const arr_del = toPositive ? entity + '_pos' : entity + '_neg';
        const arr_add = toPositive ? entity + '_neg' : entity + '_pos';

        this.search_data[arr_del].data = this.arrayRemove(this.search_data[arr_del].data, entry);
        this.search_data[arr_add].data.push(entry);
        await this.slidingList.closeSlidingItems();
  }

  async deleteEntry(entry, entity) {
    this.search_data[entity].data = this.arrayRemove(this.search_data[entity].data, entry);
    await this.slidingList.closeSlidingItems();
  }

  private arrayRemove(arr, value) {
        return arr.filter(function(ele) {
            return ele != value;
        });
  }

  test(year_pos) {
    // this.year_pos_max = year_pos.upper;
    // this.year_pos_min = year_pos.lower;
  }

  negateValue(value, slidingItem) {
      this.movie_year_enabled[value] = !this.movie_year_enabled[value];
      slidingItem.close();
  }
}
