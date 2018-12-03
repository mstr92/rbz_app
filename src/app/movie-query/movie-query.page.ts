import {Component, ElementRef, HostBinding, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {MovieSearchPage} from '../movie-search/movie-search.page';
import {CompleteMovieSearchRequest, PartialMovieSearchRequest, Movie, Actor, Year, Genre, Keyword} from '../../interfaces/movieInterface';
import { LoadingController } from '@ionic/angular';
import {QuerybuilderService} from '../../service/querybuilder.service';

@Component({
  selector: 'app-movie-query',
  templateUrl: './movie-query.page.html',
  styleUrls: ['./movie-query.page.scss'],
})
export class MovieQueryPage implements OnInit {

    icon_maxmin_visible: any;
    search_data: CompleteMovieSearchRequest;
    movie_year_enabled: any = {
        positive: false,
        negative: false
    };
    year_pos: any = {
        upper: 2020,
        lower: 1960
    };
    year_neg: any = {
        upper: 2020,
        lower: 1960
    };
    number_results = 1;
    @ViewChild('slidingList') slidingList;

    constructor(public modalCtrl: ModalController,
                public loadingController: LoadingController,
                public navCtrl: NavController,
                public queryBuilder: QuerybuilderService) {
        this.icon_maxmin_visible = {movie: true, year: true, actor: true, genre: true, keyword: true};
    }

    ngOnInit() {
        this.search_data = {
            entity: 'Movie',
            data: <PartialMovieSearchRequest>{
                movies: [],
                actors: [],
                genres: [],
                keywords: []
            },
            length: 0
        };
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
        }
    }

    // entity: Name of the entity
    minmaxCardContent(entity) {
        this.icon_maxmin_visible[entity] = !this.icon_maxmin_visible[entity];
    }

    async changeAlignment(entry, entity) {
        entry.alignment = entry.alignment === 'positive' ? 'negative' : 'positive';
        await this.slidingList.closeSlidingItems();
        // TODO: Sort funktioniert nicht, wenn neu gezeichnet sliding des ersten elements geht nicht mehr
        // this.search_data.data[entity].sort((b, a) => (a.alignment > b.alignment) ? 1 : ((b.alignment > a.alignment) ? -1 : 0));
    }

    async deleteEntry(entry, entity) {
        this.search_data.data[entity] = this.arrayRemove(this.search_data.data[entity], entry);
        await this.slidingList.closeSlidingItems();
    }

    private arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }

    negateValue(value, slidingItem) {
        this.movie_year_enabled[value] = !this.movie_year_enabled[value];
        slidingItem.close();
    }

    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            spinner: 'crescent',
            duration: 2000,
            message: 'Calculating Result! \nPlease wait...',
            translucent: true,
            keyboardClose: true
        });
        // TODO: send query to server, check if a response is send back, go after some time or loaded data to result page
        this.queryBuilder.buildMovieQuery(this.search_data)
        this.navCtrl.navigateForward('/movie-result');
        return await loading.present();
    }
}
