import { Injectable } from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Movie} from '../interfaces/movieInterface';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  constructor(public storage: NativeStorage) { }

  initializeStorage() {
      const arr: Array<Movie> = [];
      this.storage.setItem('favouriteMovies', {data: arr})
          .then(
              () => console.log('Stored item!!!'),
              error => console.error('Error storing item', error)
          );
  }

  addMovie(movie) {
      this.storage.getItem('favouriteMovies')
          .then(
              data => {
                  console.log(data.data);
                  const arr: Array<Movie> = data.data;
                  arr.push(movie);
                  this.storage.setItem('favouriteMovies', {data: arr})
                      .then(
                          () => console.log('Stored item!!!'),
                          error => console.error('Error storing item', error)
                      );
              },
              error => console.error(error)
          );
  }
  getMovie() {
      this.storage.getItem('favouriteMovies')
          .then(
              data => console.log(data),
              error => console.error(error)
          );
  }

}
