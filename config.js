module.exports = {
  port: {
    prod: 3001,
    dev: 7070,
    test: 8181
  },
  db: {
    prod: 'mongodb://user:pass@example.com:1234/bzv',
    dev: 'mongodb://localhost:27017/bzv-dev',
    test: 'mongodb://localhost:27017/bzv-test'
  }
};
