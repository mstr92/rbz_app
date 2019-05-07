import {Injectable} from '@angular/core';
import {Constants} from '../constants';

@Injectable({
    providedIn: 'root'
})
export class ConstantsService {
    constants;
    constructor() {
        this.constants = Constants;
    }
}
