import {inject} from 'aurelia-framework';
import {AuthorizeStep, AuthService, FetchConfig} from 'aurelia-auth';

@inject(AuthService, FetchConfig)
export class App {

  constructor(authService, fetchConfig) {
    this.authService = authService;
    this.fetchConfig = fetchConfig;
  }

  activate() {
    this.fetchConfig.configure();
  };

  configureRouter(config, router) {
    config.title = 'bzv';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['','home'], name: 'home', moduleId: './route/home', nav: false, title: 'Home', auth: true },
      { route: 'votes', name: 'votes', moduleId: './route/votes', nav: true, title: 'Stemmen', auth: true },
      { route: 'rank', name: 'rank', moduleId: './route/rank', nav: true, title: 'Stand', auth: true },
      { route: 'account', name: 'account', moduleId: './auth/account', nav: false, title:'Account' },
      { route: 'signup', name: 'signup', moduleId: './auth/signup', nav: false, title:'Registreer' },
      { route: 'login', name: 'login', moduleId: './auth/login', nav: false, title:'Log in' },
      { route: 'logout', name: 'logout', moduleId: './auth/logout', nav: false, title:'Log uit' }
    ]);

    this.router = router;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}