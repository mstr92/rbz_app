import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {HTTP} from '@ionic-native/http/ngx';


@Injectable()
export class ApiService {

    constructor(public httpClient: HTTP) {
    }

    static createAPIUrl(entity) {
        return 'http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/movies/' + entity + '/';
    }

    getDataBySearchTerm(entity, searchTerm) {
        if (entity == Constants.ACTOR) entity = 'person';
        return this.httpClient.get(ApiService.createAPIUrl(entity) + searchTerm, {}, {Accept: 'application/json'})
            .then(data => {
                if(data.status == 201) {
                    return data.data;
                }
            })
            .catch(error => {
                return null;
            });
    }

    getDetailedMovieInfo(imdb_id) {
        return this.httpClient.get(ApiService.createAPIUrl('movie') + 'details/' + imdb_id, {}, {});
    }

    getDetailedMovieInfo1(imdb_id) {
        return this.httpClient.get('https://api.themoviedb.org/3/find/' + imdb_id + '?api_key=4011e631409cb9aad814f2e2a03df031&external_source=imdb_id', {}, {});
    }


}
