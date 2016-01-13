import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import authConfig from 'auth/config';

@inject(HttpClient)
export class DataService {

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetch(url, init) {
    return this.httpClient.fetch(url)
        .then(res => {
          if (!res.ok) {
            throw new Error('fetch failed');
          }
          return res.json();
        })
  }

  fetchUsers() {
    return this.fetch(`${authConfig.baseUrl}/user`)
      .then(users => {
        return users.sort((a,b) => a.points.totalPoints <= b.points.totalPoints);
      });
  }
}