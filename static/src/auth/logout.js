import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';

@inject(AuthService)
export class Login {
  heading = 'Log uit';
  logoutError = '';

  constructor(authService) {
    this.authService = authService;
    this.logout();
  }

  logout() {
    return this.authService.logout()
      .catch(error => {
        this.loginError = error.reason || error.message || error.response || error;
      });
  };
}