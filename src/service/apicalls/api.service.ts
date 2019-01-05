import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {HTTP} from '@ionic-native/http/ngx';


@Injectable()
export class ApiService {


    constructor(public http: HTTP) {

    }

    static createAPIUrl(entity) {
        return 'http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/movies/' + entity + '/';
    }

    getDataBySearchTerm(entity, searchTerm) {
        if (entity == Constants.ACTOR) entity = 'person';
        return this.http.get(ApiService.createAPIUrl(entity) + searchTerm, {}, {Accept: 'application/json'})
            .then(data => {
                if (data.status == 201) {
                    return data.data;
                }
            })
            .catch(error => {
                return null;
            });
    }

    getDetailedMovieInfo(imdb_id) {
        return this.http.get(ApiService.createAPIUrl('movie') + 'details/' + imdb_id, {}, {});
    }

    setUser(account) {
        this.http.setDataSerializer('json');
        return this.http.post('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/user',
            {
                'username': account.username,
                'email': account.email,
                'password': account.password
            }, {},);
    }

    getUser(username) {
        return this.http.get('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/user/' + username, {}, {})
            .then(data => {
                if (data.status == 201) {
                    return data.data;
                }
            })
            .catch(error => {
                return null;
            });
    }
    getUserPassword(username, password) {
        return this.http.get('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/password/' + username + '/' + password, {}, {});
    }

    setBackup(history, rating, favourite, user_id) {
        this.http.setDataSerializer('json');
        return this.http.post('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/backup',
            {
                'favourite': favourite,
                'rating': rating,
                'user_id': user_id,
                'history': history
            }, {});
    }
    getBackup(user_id, entity) {
      return this.http.get('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/backup/' + entity + '/' + user_id, {},{});
    }
    getBackupLastDate(user_id){
        return this.http.get('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/backup/dates/' + user_id, {},{});
    }
    setUUID(uuid) {
        return this.http.get('http://' + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/uuid/' + uuid, {},{})
    }
}
