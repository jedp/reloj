
/**
 * Module dependencies.
 */

var express = require('express');
var _ = require('underscore');
var redis = require('redis');
var models = require('./models');
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
  models.Log.find({})
    .sort('date', -1)
    .limit(100)
    .execFind(function(err, logs) {
      res.render('index', {
        title: 'reloj console',
        logs: logs
      });
    });
});

app.get('/channels', function(req, res) {
  res.render('channels', {
    title: 'reloj: subscription channels'
  });
});

// Listen on redis channels


models.RedisSubscription.find({}, function(err, subscriptions) {
  _.each(subscriptions, function(subscription) {
    var redis_subscriber = redis.createClient(
      subscription.redis_port,
      subscription.redis_host
    );
    redis_subscriber.on("message", function(channel, message) {
      message = JSON.parse(message);
      try {
        everyone.now.addRecord(message);
      } catch (err) {
        console.error(err);
      }
      var record = new models.Log(message);
      record.save();
    });
    redis_subscriber.subscribe(subscription.channel);
  });
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
