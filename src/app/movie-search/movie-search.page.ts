import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Checkbox, ModalController, NavController, NavParams, Platform} from '@ionic/angular';
import {Searchbar, Item} from '@ionic/angular';
import {PartialMovieSearchRequest, Movie, Actor, Year, Genre, Keyword} from '../../interfaces/movieInterface';
import {Keyboard} from '@ionic-native/keyboard/ngx';
// import { HTTP } from '@ionic-native/http/ngx';
import {Http} from '@angular/http';

@Component({
    selector: 'app-movie-search',
    templateUrl: './movie-search.page.html',
    styleUrls: ['./movie-search.page.scss'],
})

export class MovieSearchPage implements OnInit {
    isToggled = false;
    search_data: any;
    searchTerm = '';
    current_selected_search: PartialMovieSearchRequest;
    selected_search_data: PartialMovieSearchRequest = {};
    keywords: Array<Keyword> = [];
    search_genres: Array<[Genre, boolean]> = [];
    selected_genres: Array<Genre> = [];
    search_movies: Array<[Movie, boolean]> = [];
    selected_movies: Array<Movie> = [];
    search_actors: Array<[Actor, boolean]> = [];
    selected_actors: Array<Actor> = [];
    @ViewChild('searchbar') searchbar: Searchbar;
    @ViewChild('keywordItem') keywordItem: Item;
    @ViewChild('keywordCheckbox') keywordCheckbox: Checkbox;
    genre_request;
    movie_request;
    actor_request;

    constructor(navCtrl: NavController,
                params: NavParams,
                public modalCtrl: ModalController,
                private keyboard: Keyboard,
                public http: Http,
                public platform: Platform
                ) {
        // Disable Hardware Back Button in Modal
        this.platform.backButton.subscribe(() => {
        });

        this.current_selected_search = params.get('data');
        this.selected_genres = this.current_selected_search.genres;
        this.selected_actors = this.current_selected_search.actors;
        this.selected_movies = this.current_selected_search.movies;
    }

    ngOnInit() {
    }

    cancelSearch() {
        this.modalCtrl.dismiss(null);
    }

    addSearchEntries() {
        this.selected_search_data.keywords = this.keywords;
        this.selected_search_data.genres = this.selected_genres;
        this.selected_search_data.movies = this.selected_movies;
        this.selected_search_data.actors = this.selected_actors
        this.modalCtrl.dismiss(this.selected_search_data);
    }

    selectEntity(id, entity) {
        this.search_data[entity].data.find(function (x) {
            if (x.id === id) {
                x.selected = !x.selected;
            }
        });

    }

    setFilteredData() {
        if (this.genre_request !== undefined) {
            this.genre_request.unsubscribe();
        }
        if (this.movie_request !== undefined) {
            this.movie_request.unsubscribe();
        }
        if (this.actor_request !== undefined) {
            this.actor_request.unsubscribe();
        }
        if (this.searchTerm.length > 0) {
            // ------- Genre -------------
            this.genre_request = this.http.get('http://127.0.0.1:5000/genre/' + this.searchTerm).subscribe(data => {
                this.search_genres = [];
                const dataJson = data.json();
                dataJson.data.forEach(element => {
                    const isSelected = this.selected_genres.find(item => item.id === element.id);
                    const isCurrentlySelected = this.current_selected_search.genres.find(item => item.id === element.id);
                    if (isSelected !== undefined) {
                        this.search_genres.push([<Genre>{id: element.id, name: element.genrename, alignment: isSelected.alignment}, true]);
                    } else if (isCurrentlySelected !== undefined) {
                        this.search_genres.push([<Genre>{
                            id: element.id,
                            name: element.genrename,
                            alignment: isCurrentlySelected.alignment
                        }, true]);
                    } else {
                        this.search_genres.push([<Genre>{id: element.id, name: element.genrename, alignment: ''}, false]);
                    }
                });
            });
            // ------- Movies -------------
            this.movie_request = this.http.get('http://127.0.0.1:5000/movie/' + this.searchTerm).subscribe(data => {
                this.search_movies = [];
                const dataJson = data.json();
                dataJson.data.forEach(element => {
                    const isSelected = this.selected_movies.find(item => item.id === element.id);
                    const isCurrentlySelected = this.current_selected_search.movies.find(item => item.id === element.id);
                    if (isSelected !== undefined) {
                        this.search_movies.push([<Movie>{
                            id: element.id,
                            imdb_id: element.ttid,
                            title: element.title,
                            image: element.imglink,
                            year: element.year,
                            alignment: isSelected.alignment
                        }, true]);
                    } else if (isCurrentlySelected !== undefined) {
                        this.search_movies.push([<Movie>{
                            id: element.id,
                            imdb_id: element.ttid,
                            title: element.title,
                            image: element.imglink,
                            year: element.year,
                            alignment: isCurrentlySelected.alignment
                        }, true]);
                    } else {
                        this.search_movies.push([<Movie>{ id: element.id,
                            imdb_id: element.ttid,
                            title: element.title,
                            image: element.imglink,
                            year: element.year,
                            alignment: ''}, false]);
                    }
                });
            });
            // ------- Actor  -------------
            this.actor_request = this.http.get('http://127.0.0.1:5000/person/' + this.searchTerm).subscribe(data => {
                this.search_actors = [];
                const dataJson = data.json();
                dataJson.data.forEach(element => {
                    const isSelected = this.selected_actors.find(item => item.id === element.id);
                    const isCurrentlySelected = this.current_selected_search.actors.find(item => item.id === element.id);
                    if (isSelected !== undefined) {
                        this.search_actors.push([<Actor>{
                            id: element.id,
                            firstname: element.first_name,
                            lastname: element.last_name,
                            alignment: isSelected.alignment
                        }, true]);
                    } else if (isCurrentlySelected !== undefined) {
                        this.search_actors.push([<Actor>{
                            id: element.id,
                            firstname: element.first_name,
                            lastname: element.last_name,
                            alignment: isCurrentlySelected.alignment
                        }, true]);
                    } else {
                        this.search_actors.push([<Actor>{
                            id: element.id,
                            firstname: element.first_name,
                            lastname: element.last_name,
                            alignment: ''}, false]);
                    }
                });
            });
        } else {
            this.search_genres = [];
            this.search_movies = [];
            this.search_actors = [];
        }
    }

    addToGenreList(id) {
        const genre = this.search_genres.find(item => item[0].id === id);
        if (genre[1] === true) {
            genre[1] = false;
            this.selected_genres = this.arrayRemoveById(this.selected_genres, genre[0]);
        } else {
            genre[0].alignment = this.isToggled ? 'negative' : 'positive';
            genre[1] = true;
            this.selected_genres.push(genre[0]);
        }
    }
    addToMovieList(id) {
        const movie = this.search_movies.find(item => item[0].id === id);
        if (movie[1] === true) {
            movie[1] = false;
            this.selected_movies = this.arrayRemoveById(this.selected_movies, movie[0]);
        } else {
            movie[0].alignment = this.isToggled ? 'negative' : 'positive';
            movie[1] = true;
            this.selected_movies.push(movie[0]);
        }
    }

    addToActorList(id) {
        const actor = this.search_actors.find(item => item[0].id === id);
        if (actor[1] === true) {
            actor[1] = false;
            this.selected_actors = this.arrayRemoveById(this.selected_actors, actor[0]);
        } else {
            actor[0].alignment = this.isToggled ? 'negative' : 'positive';
            actor[1] = true;
            this.selected_actors.push(actor[0]);
        }
    }

    addToKeywordList(keyword) {
        this.keywords.push(<Keyword>{name: keyword, alignment: this.isToggled ? 'negative' : 'positive'});
        this.keywordCheckbox.checked = true;
    }

    deleteKeywordFromList(keyword) {
        this.keywords = this.arrayRemove(this.keywords, keyword);
    }

    keyWordNotInList() {
        return !this.keywords.find(e => e.name === this.searchTerm);
    }

    // TODO: also used in movie detail search page -> auslagern
    private arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }

    private arrayRemoveById(arr, value) {
        return arr.filter(function (ele) {
            return ele.id !== value.id;
        });
    }
}
