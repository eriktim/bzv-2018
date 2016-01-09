import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';

@inject(AuthService)
export class Login {
  heading = 'Log in';
  email = '';
  password = '';
  loginError = '';

  constructor(authService) {
    this.authService = authService;
  }

  login() {
    return this.authService.login(this.email, this.password)
      .then(response => {
        console.log('Login response: ' + response);
      })
      .catch(error => {
        this.loginError = error.reason || error.message || error.response || error;
      });
  };
}