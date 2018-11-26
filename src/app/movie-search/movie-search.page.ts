import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Checkbox, ModalController, NavController, NavParams} from '@ionic/angular';
import {Searchbar, Item} from '@ionic/angular';
import {PartialMovieSearchRequest, Movie, Actor, Year, Genre, Keyword} from '../../interfaces/movieInterface';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
    selector: 'app-movie-search',
    templateUrl: './movie-search.page.html',
    styleUrls: ['./movie-search.page.scss'],
})

export class MovieSearchPage implements OnInit, AfterViewInit {
    isToggled = false;
    search_data: any;
    filtered_genres: any;
    searchTerm: string = '';
    selected_search_data: PartialMovieSearchRequest = {};
    keywords: Array<Keyword> = [];
    @ViewChild('searchbar') searchbar: Searchbar;
    @ViewChild('keywordItem') keywordItem: Item;
    @ViewChild('keywordCheckbox') keywordCheckbox: Checkbox;


    constructor(navCtrl: NavController, params: NavParams, public modalCtrl: ModalController, private keyboard: Keyboard) {

    }

    ngOnInit() {
        this.search_data = {
            movie: {
                data: [
                    {id: 1, name: 'Lord of the Rings 1', img: 'img1.jpg', year: 2006, selected: false},
                    {id: 2, name: 'Lord of the Rings 2', img: 'img2.jpg', year: 2008, selected: true}
                ],
            },
            genre: {
                data: [
                    {id: 1, name: 'Action', selected: false},
                    {id: 2, name: 'Adventure', selected: false},
                    {id: 3, name: 'Animation', selected: false},
                    {id: 4, name: 'Adult', selected: false},
                    {id: 5, name: 'Comedy', selected: false},
                    {id: 6, name: 'Commercial', selected: false},
                    {id: 7, name: 'Documentary', selected: false}
                ],
            },
            actor: {
                data: [
                    {id: 7, name: 'Documentary', selected: false}
                ],
            }
        };
        this.filtered_genres = this.search_data.genre.data.slice(0, 5);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.searchbar.focus();
        }, 150);
    }

    cancelSearch() {
        this.modalCtrl.dismiss(null);
    }
    addSearchEntries() {
        this.selected_search_data.keywords = this.keywords;
        this.modalCtrl.dismiss(this.selected_search_data);
    }

    selectEntity(id, entity) {
        this.search_data[entity].data.find(function (x) {
            if (x.id === id ) {
                x.selected = !x.selected;
            }
        });

    }
    setFilteredData() {
        this.filtered_genres = this.search_data.genre.data.filter((data) => {
            return data.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        }).slice(0, 5);
    }
    addToKeywordList(keyword) {
        this.keywords.push(<Keyword>{name: keyword, alignment: this.isToggled ? 'negative' : 'positive'});
        this.keywordCheckbox.checked = true;
    }
    deleteKeywordFromList(keyword) {
        this.keywords = this.arrayRemove(this.keywords, keyword);
    }
    keyWordNotInList() {
        return this.keywords.find(e => e.name === this.searchTerm);
    }

    // TODO: also used in movie detail search page -> auslagern
    private arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }
}
