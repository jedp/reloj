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

var LogSchema = new Schema({
  date: Date,
  name: String,
  msg: String,
  funcname: String,
  filename: String,
  line_no: Number,
  username: String,
  hostname: String,
  args: String,
  traceback: String
}

mongoose.model('LogModel', LogSchema);

var Log = mongoose.model('LogModel');

if (typeof exports !== 'undefined') {
  exports.Log = Log
}
