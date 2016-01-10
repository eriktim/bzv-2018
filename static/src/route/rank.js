import {inject} from 'aurelia-framework';
import {DataService} from '../dataservice'

@inject(DataService)
export class Rank {
  users = []

  constructor(dataService) {
    dataService.fetchUsers()
      .then(users => {this.users = users});
  }
}