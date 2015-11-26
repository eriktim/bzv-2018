var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Peasant = new Schema({
  name: String,
  year: Number
});

module.exports = mongoose.model('Peasant', Peasant);
