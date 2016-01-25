import {inject} from 'aurelia-framework';
import {DataService} from '../dataservice'

@inject(DataService)
export class Votes {
  votes = [];
  peasants = [];
  candidates = [];
  periods = [];
  thePeasant;
  theCandidates = [];
  voteMap = new Map();

  constructor(dataService) {
    this.dataService = dataService;
  }

  activate() {
    return Promise.all([
      this.dataService.fetchVotes(),
      this.dataService.fetchPeasants(),
      this.dataService.fetchCandidates(),
      this.dataService.fetchPeriods(),
    ])
      .then(entities => {
        [this.votes, this.peasants, this.candidates, this.periods] = entities;
        this.select(this.peasants[0]);
      });
  }

  select(peasant) {
    this.theCandidates = this.candidates.filter(c => c.peasant == peasant._id);
    this.voteMap = new Map();
    this.periods.forEach(period => {
      let periodVoteMap = new Map();
      this.theCandidates.forEach(candidate => {
        let vote = this.votes.find(v => v.candidate == candidate._id && v.period == period._id);
        periodVoteMap.set(candidate, vote || {});
      });
      this.voteMap.set(period, periodVoteMap);
    })
    this.thePeasant = peasant;
  }
}