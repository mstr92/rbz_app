import { Injectable } from '@angular/core';
import{Constants} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class QuerybuilderService {
  constants;
  constructor() {
    this.constants = Constants;
  }

  buildMovieQuery(input) {

  }
}
