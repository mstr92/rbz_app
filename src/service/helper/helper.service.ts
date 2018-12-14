import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

    arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }

    arrayRemoveById(arr, value) {
        return arr.filter(function (ele) {
            return ele.id !== value.id;
        });
    }
}
