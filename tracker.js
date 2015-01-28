var config = require('./config.json');
var _ = require("underscore");
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var rss = require('./rss.js')(ee);
var slack = require('./slack.js');

ee.on("new", function(item, feed){
    slack.notify(item, feed.channel, feed.name);
});

if(config.rss) {
    _.each(config.rss, function(feed){
        rss.register(feed);
    });
}