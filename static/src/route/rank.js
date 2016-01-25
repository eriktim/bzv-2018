import {inject} from 'aurelia-framework';
import {DataService} from '../dataservice'

@inject(DataService)
export class Rank {
  users = [];

  constructor(dataService) {
    this.dataService = dataService;
  }

  activate() {
    this.dataService.fetchUsers()
      .then(users => this.users = users);
  }
}