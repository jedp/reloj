
/**
 * Module dependencies.
 */

var express = require('express');
var redis = require('redis');

var app = module.exports = express.createServer();
var everyone = require('now').initialize(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Listen for log messages

var redis_subscriber = redis.createClient();
redis_subscriber.on("message", function(channel, message) {
  message = JSON.parse(message);
  everyone.now.addRecord(message)
});
redis_subscriber.subscribe("log");


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
