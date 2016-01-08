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
      { route: ['','home'], name: 'home', moduleId: './routes/home', nav: false, title: 'Home' },
      { route: 'votes', name: 'votes', moduleId: './routes/votes', nav: true, title: 'Stemmen', auth: true },
      { route: 'rank', name: 'rank', moduleId: './routes/rank', nav: true, title: 'Stand', auth: true },
      { route: 'login', name: 'login', moduleId: './auth/login', nav: false, title:'Login', authRoute: true },
      { route: 'logout', name: 'logout', moduleId: './auth/logout', nav: false, title:'Logout', authRoute: true },
      { route: 'signup', name: 'signup', moduleId: './auth/signup', nav: false, title:'Sign Up', authRoute: true }
    ]);

    this.router = router;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}