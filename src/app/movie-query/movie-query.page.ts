import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {MovieSearchPage} from '../movie-search/movie-search.page';
import {CompleteMovieSearchRequest, PartialMovieSearchRequest, Movie} from '../../interfaces/movieInterface';
import {HelperService} from '../../service/helper/helper.service';
import {Constants} from '../../service/constants';

@Component({
    selector: 'app-movie-query',
    templateUrl: './movie-query.page.html',
    styleUrls: ['./movie-query.page.scss'],
})
export class MovieQueryPage implements OnInit {

    icon_maxmin_visible = {movie: true, year: true, actor: true, genre: true, keyword: true};
    movie_year_enabled = {positive: false, negative: false};
    year_pos = {upper: Constants.MAX_YEAR, lower: Constants.MIN_YEAR};
    year_neg = {upper: Constants.MAX_YEAR, lower: Constants.MIN_YEAR};
    number_results = 10;
    entities = ['movies', 'actors', 'genres', 'keywords'];
    search_data: CompleteMovieSearchRequest = {
        entity: 'Movie',
        data: <PartialMovieSearchRequest>{movies: [], actors: [], genres: [], keywords: []},
        length: 0
    };

    @ViewChild('slidingList') slidingList;

    constructor(public modalCtrl: ModalController,
                public navCtrl: NavController,
                public helperService: HelperService) {
        if(this.helperService.movie_request_refine) {
            this.search_data = this.helperService.movie_request_to_pass;
        }
    }

    ngOnInit() {
    }

    openDetailSearch() {
        const res = this.openSearchModal();
    }

    async openSearchModal() {
        const modal = await this.modalCtrl.create({
            component: MovieSearchPage,
            componentProps: {data: this.search_data.data}
        });
        modal.onDidDismiss().then((data) => {
            this.setSearchedData(data);
        });
        return await modal.present();
    }

    setSearchedData(data) {
        if (data.data != null) {
            for (const keyword of data.data.keywords) {
                if (!this.search_data.data.keywords.find(e => e.name.toLowerCase() === keyword.name.toLowerCase())) {
                    this.search_data.data.keywords.push(keyword);
                }
            }
            this.search_data.data.genres = data.data.genres;
            this.search_data.data.movies = data.data.movies;
            this.search_data.data.actors = data.data.actors;

            this.entities.forEach(entity => {
                this.search_data.data[entity].sort((b, a) => (a.alignment > b.alignment) ? 1 : ((b.alignment > a.alignment) ? -1 : 0));
            });
        }
    }

    // entity: Name of the entity
    minmaxCardContent(entity) {
        this.icon_maxmin_visible[entity] = !this.icon_maxmin_visible[entity];
    }

    async changeAlignment(entry, entity) {
        entry.alignment = entry.alignment === Constants.POSITIVE ? Constants.NEGATIVE : Constants.POSITIVE;
        this.search_data.data[entity].sort((b, a) => (a.alignment > b.alignment) ? 1 : ((b.alignment > a.alignment) ? -1 : 0));
        await this.slidingList.closeSlidingItems();
    }

    async deleteEntry(entry, entity) {
        this.search_data.data[entity] = this.helperService.arrayRemove(this.search_data.data[entity], entry);
        await this.slidingList.closeSlidingItems();
    }

    negateValue(value, slidingItem) {
        this.movie_year_enabled[value] = !this.movie_year_enabled[value];
        slidingItem.close();
    }
    goToResultPage() {
        this.helperService.movie_request_to_pass = this.search_data;
        this.helperService.movie_request_refine = false;
        this.navCtrl.navigateForward('/movie-result');
    }
}
