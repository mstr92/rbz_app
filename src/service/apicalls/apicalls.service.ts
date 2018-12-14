import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Genre} from '../../interfaces/movieInterface';

const HOST = "127.0.0.1";
const PORT = "5000";

@Injectable({
  providedIn: 'root'
})
export class ApicallsService {

    constructor(public http: Http,) {
    }
}
