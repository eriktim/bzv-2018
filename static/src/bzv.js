import authConfig from './auth/config';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-auth', builder => {
         builder.configure(authConfig);
    });
  aurelia.start().then(a => a.setRoot());
}