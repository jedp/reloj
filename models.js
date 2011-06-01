// load settings
var fs = require('fs');
var _ = require('underscore');
eval(fs.readFileSync('./config.js', 'ascii'));

if (typeof settings.dbname === 'undefined') {
// don't proceed unless dbname is specified
  settings.dbname = 'reloj';
}

function nocallback() {}

var mongoose = require('mongoose/');
mongoose.connect ('mongodb://localhost/' + settings.dbname);

var Schema = mongoose.Schema;

var RedisSubscriptionSchema = new Schema({
  redis_host: String,
  redis_port: String,
  channel: String
});

// Our users, and the logs they follow
// The FilterSchema is an embedded document
var FilterSchema = new Schema({
  name: String,
  level: String,
});

var UserSchema = new Schema({
  username: String,
  following: [FilterSchema]
});

var LogSchema = new Schema({
  date: Date,
  name: String,
  msg: String,
  level: String,
  funcname: String,
  filename: String,
  line_no: Number,
  username: String,
  hostname: String,
  args: String,
  traceback: String
});

mongoose.model('RedisSubscriptionModel', RedisSubscriptionSchema);
mongoose.model('LogModel', LogSchema);
mongoose.model('UserModel', UserSchema);

var RedisSubscription = mongoose.model('RedisSubscriptionModel');
var Log = mongoose.model('LogModel');
var User = mongoose.model('UserModel');

if (typeof exports !== 'undefined') {
  exports.Log = Log;
  exports.User = User;
  exports.RedisSubscription = RedisSubscription;
}
