var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var User = new Schema({
  year: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  },
  hash: {
    type: String,
    set: function(val) {
      if (val.match(/^\$2[ayb]\$.{56}$/)) {
        return val;
      }
      return bcrypt.hashSync(val, 10);
    },
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'user', 'visitor']
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

User.methods.hasPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.hash, function(err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

User.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.hash;
  return obj;
};

User.pre('remove', function(next) {
  this.model('Vote').remove({user: this._id}, next);
});

module.exports = mongoose.model('User', User);
