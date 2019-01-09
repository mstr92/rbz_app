import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {HTTP} from '@ionic-native/http/ngx';
import {Device} from '@ionic-native/device/ngx';
//import {ResultparserService} from '../resultparser/resultparser.service';


@Injectable()
export class ApiService {


    constructor(public http: HTTP, private device: Device) { //, private parser:ResultparserService) {
    }

    static createAPIUrl(entity) {
        return Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/movies/' + entity + '/';
    }

    getDataBySearchTerm(entity, searchTerm) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        if (entity == Constants.ACTOR) entity = 'person';
        return this.http.get(ApiService.createAPIUrl(entity) + searchTerm, {}, {'key': Constants.API_KEY})
            .then(data => {
                if (data.status == 201) {
                    return data.data;
                }
            })
            .catch(error => {
                console.log(error);
                return null;
            });
    }

    getDetailedMovieInfo(imdb_id) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
         return this.http.get(ApiService.createAPIUrl('movie') + 'details/' + imdb_id, {}, {'key': Constants.API_KEY});
    }

    setUser(account) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        this.http.setDataSerializer('json');
        return this.http.post(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/user',
            {
                'username': account.username,
                'email': account.email,
                'password': account.password
            }, {'key': Constants.API_KEY},);
    }

    setUserUUID(username) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        this.http.setDataSerializer('json');
        return this.http.post(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/user/deviceId',
            {
                'username': username,
                'deviceId': this.device.uuid,
            }, {'key': Constants.API_KEY},);
    }


    getUser(username) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.get(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/user/' + username, {}, {'key': Constants.API_KEY})
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
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.get(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/password/' + username + '/' + password, {}, {'key': Constants.API_KEY});
    }

    setBackup(history, rating, favourite, user_id) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        this.http.setDataSerializer('json');
        return this.http.post(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/backup',
            {
                'favourite': favourite,
                'rating': rating,
                'user_id': user_id,
                'history': history
            }, {});
    }

    getBackup(user_id, entity) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.get(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/backup/' + entity + '/' + user_id, {}, {'key': Constants.API_KEY});
    }

    getBackupLastDate(user_id) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.get(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/backup/dates/' + user_id, {}, {'key': Constants.API_KEY});
    }

    setUUID(uuid) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.post(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/general/uuid/' + uuid, {}, {'key': Constants.API_KEY});
    }
    setEngineRequest(request_body, oneSignal_id) {
        this.http.setDataSerializer('json');
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.post(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/movies/' + oneSignal_id, request_body, {'key': Constants.API_KEY});
    }
    getEngineResponse(id) {
        this.http.setSSLCertMode(Constants.CHECK_SSL);
        return this.http.get(Constants.PROTOCOL + Constants.HOST + ':' + Constants.PORT + '/api/rbz/movies/' + id, {}, {'key': Constants.API_KEY});
    }
}
