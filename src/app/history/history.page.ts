import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

    slideOpts = {
        slidesPerView: 1.5,
        slidesPerColumn: 2
    };

    constructor() {
    }

    ngOnInit() {
    }

}
