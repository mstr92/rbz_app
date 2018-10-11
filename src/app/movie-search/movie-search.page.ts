import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {Searchbar} from '@ionic/angular';

@Component({
    selector: 'app-movie-search',
    templateUrl: './movie-search.page.html',
    styleUrls: ['./movie-search.page.scss'],
})
export class MovieSearchPage implements OnInit, AfterViewInit {
    search_query: string;
    isToggled: boolean;
    @ViewChild('searchbar') searchbar: Searchbar;


    constructor(navCtrl: NavController, params: NavParams, public modalCtrl: ModalController) {
        this.search_query = params.get('input');
        this.isToggled = false;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.searchbar.focus();
        }, 150);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    notify() {

    }
}
