import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const HOST = "127.0.0.1";
const PORT = "5000";

@Injectable()
export class ApiService {

    constructor(public httpClient: HttpClient) {
    }

    static createAPIUrl(entity) {
      return "http://" + HOST + ":" + PORT + "/" + entity + "/";
    }

    getDataBySearchTerm(entity, searchTerm) {
        if (entity == "actor") entity = "person";
        return this.httpClient.get(ApiService.createAPIUrl(entity) + searchTerm);
    }
}
