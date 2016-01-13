var devConfig = {
  baseUrl: 'http://localhost:7070/api',
  signupUrl: 'users',
  loginUrl: 'authenticate',
  tokenName: 'token',
  authHeader: 'x-access-token',
  authToken: '',
  loginRedirect: '#/'
};

var config;
if (window.location.hostname === 'localhost') {
  config = devConfig;
} else {
  config = devConfig;
}

export default config;