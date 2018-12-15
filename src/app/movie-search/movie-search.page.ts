import {Component, OnInit, ViewChild} from '@angular/core';
import {Checkbox, ModalController, NavController, NavParams, Platform} from '@ionic/angular';
import {Searchbar, Item} from '@ionic/angular';
import {PartialMovieSearchRequest, Movie, Actor, Genre, Keyword} from '../../interfaces/movieInterface';
import {HelperService} from '../../service/helper/helper.service';
import {ApiService} from '../../service/apicalls/api.service';

interface SearchData {
    search_genre: Array<[Genre, boolean]>;
    selected_genre: Array<Genre>;
    search_movie: Array<[Movie, boolean]>;
    selected_movie: Array<Movie>;
    search_actor: Array<[Actor, boolean]>;
    selected_actor: Array<Actor>;
}
interface ApiRequest {
    genre: Promise<any>;
    movie: Promise<any>;
    actor: Promise<any>;
}

@Component({
    selector: 'app-movie-search',
    templateUrl: './movie-search.page.html',
    styleUrls: ['./movie-search.page.scss'],
})

export class MovieSearchPage implements OnInit {
    isNegativeAlignment = false;
    searchTerm = '';
    current_selected_search: PartialMovieSearchRequest;
    selected_search_data: PartialMovieSearchRequest = {};
    keywords: Array<Keyword> = [];
    searchdata: SearchData;
    requests: ApiRequest;

    @ViewChild('searchbar') searchbar: Searchbar;
    @ViewChild('keywordItem') keywordItem: Item;
    @ViewChild('keywordCheckbox') keywordCheckbox: Checkbox;

    constructor(navCtrl: NavController,
                params: NavParams,
                public modalCtrl: ModalController,
                public platform: Platform,
                public helperService: HelperService,
                public apiService: ApiService
    ) {
        // Disable Hardware Back Button in Modal
        this.platform.backButton.subscribe(() => {
        });
        this.searchdata = {
            'search_genre': [], 'selected_genre': [],
            'search_movie': [], 'selected_movie': [],
            'search_actor': [], 'selected_actor': []
        };
        this.requests = {movie : null, actor : null, genre: null};
        this.current_selected_search = params.get('data');
        this.searchdata.selected_genre = this.current_selected_search.genres;
        this.searchdata.selected_actor = this.current_selected_search.actors;
        this.searchdata.selected_movie = this.current_selected_search.movies;
    }

    ngOnInit() {
    }

    cancelSearch() {
        this.modalCtrl.dismiss(null);
    }

    addSearchEntries() {
        this.selected_search_data.keywords = this.keywords;
        this.selected_search_data.genres = this.searchdata.selected_genre;
        this.selected_search_data.movies = this.searchdata.selected_movie;
        this.selected_search_data.actors = this.searchdata.selected_actor;
        this.modalCtrl.dismiss(this.selected_search_data);
    }

    static createGenreArray(element, alignment, selected) {
        return [<Genre>{
            id: element.id, name: element.genrename, alignment: alignment
        }, selected];
    }

    static createMovieArray(element, alignment, selected) {
        return [<Movie>{
            id: element.id, imdb_id: element.ttid, title: element.title,
            image: element.imglink, year: element.year, alignment: alignment
        }, selected];
    }

    static createActorArray(element, alignment, selected) {
        return [<Actor>{
            id: element.id, firstname: element.first_name, lastname: element.last_name, alignment: alignment
        }, selected];
    }

    setData(entity) {
        this.requests[entity] = this.apiService.getDataBySearchTerm(entity, this.searchTerm).subscribe(data => {
            this.searchdata['search_' + entity] = [];
            const dataJson = JSON.parse(JSON.stringify(data));
            dataJson.data.forEach(element => {
                const isSelected = this.searchdata['selected_' + entity].find(item => item.id === element.id);
                const isCurrentlySelected = this.current_selected_search[entity + 's'].find(item => item.id === element.id);
                if (isSelected !== undefined) {
                    if (entity == 'genre') this.searchdata['search_' + 'genre'].push(MovieSearchPage.createGenreArray(element, isSelected.alignment, true));
                    if (entity == 'movie') this.searchdata['search_' + 'movie'].push(MovieSearchPage.createMovieArray(element, isSelected.alignment, true));
                    if (entity == 'actor') this.searchdata['search_' + 'actor'].push(MovieSearchPage.createActorArray(element, isSelected.alignment, true));
                } else if (isCurrentlySelected !== undefined) {
                    if (entity == 'genre') this.searchdata['search_' + 'genre'].push(MovieSearchPage.createGenreArray(element, isCurrentlySelected.alignment, true));
                    if (entity == 'movie') this.searchdata['search_' + 'movie'].push(MovieSearchPage.createMovieArray(element, isCurrentlySelected.alignment, true));
                    if (entity == 'actor') this.searchdata['search_' + 'actor'].push(MovieSearchPage.createActorArray(element, isCurrentlySelected.alignment, true));
                } else {
                    if (entity == 'genre') this.searchdata['search_' + 'genre'].push(MovieSearchPage.createGenreArray(element, '', false));
                    if (entity == 'movie') this.searchdata['search_' + 'movie'].push(MovieSearchPage.createMovieArray(element, '', false));
                    if (entity == 'actor') this.searchdata['search_' + 'actor'].push(MovieSearchPage.createActorArray(element, '', false));
                }
            });
        });
    }

    setFilteredData() {
        const entities = ["movie", "genre", "actor"];
        entities.forEach(entity => {
            if (this.requests[entity] !== null) {
                this.requests[entity].unsubscribe();
            }
            if (this.searchTerm.length > 0) {
                this.setData(entity);
            } else {
                this.searchdata["search_" + entity] = [];
            }
        });
    }

    addToList(entity, id) {
        const elem = this.searchdata["search_" + entity].find(item => item[0].id === id);
        if (elem[1] === true) {
            elem[1] = false;
            this.searchdata["selected_" + entity] = this.helperService.arrayRemoveById(this.searchdata["selected_" + entity], elem[0]);
        } else {
            elem[0].alignment = this.isNegativeAlignment ? 'negative' : 'positive';
            elem[1] = true;
            this.searchdata["selected_" + entity].push(elem[0]);
        }
    }

    addToKeywordList(keyword) {
        this.keywords.push(<Keyword>{name: keyword, alignment: this.isNegativeAlignment ? 'negative' : 'positive'});
        this.keywordCheckbox.checked = true;
    }

    deleteKeywordFromList(keyword) {
        this.keywords = this.helperService.arrayRemove(this.keywords, keyword);
    }

    keyWordNotInList() {
        return !this.keywords.find(e => e.name === this.searchTerm);
    }
}
