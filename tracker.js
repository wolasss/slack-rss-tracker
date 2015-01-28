var config = require('./config.json');
var _ = require("underscore");
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var rss = require('./rss.js')(ee);
var slack = require('./slack.js');
var server = require('./restify.js')(ee);

ee.on("new", function(item, feed){
    slack.notify(item, feed.channel, feed.name, feed.username);
});

ee.on("status", function(channel, feeds){
    slack.status(channel, feeds);
});

ee.on("registered", function(channel, feed){
    slack.registered(channel, feed);
});


ee.on("subscriptionRequest", function(channel, name, url, username, interval){
	var feed = {
		channel: channel,
		name: name,
		url: url,
		username: username,
		interval: interval
	}

	rss.register(feed);
});

if(config.rss) {
    _.each(config.rss, function(feed){
        rss.register(feed);
    });
}