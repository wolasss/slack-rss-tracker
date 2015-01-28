var config = require('./config.json');
var _ = require("underscore");
var dateFormat = require('dateformat');
var Slack = require('node-slack');
var slack = new Slack(config.slack.team, config.slack.token_in);

var notify = function(item, channel, name, username) {

	var attach = [];
	var html_regex = /(<([^>]+)>)/ig;

	attach.push({
		color: "good",
		text: item.description.replace(html_regex, ""),
		title: item.title,
		title_link: item.link
	})

	slack.send({
        text: "*"+name+"*",
		channel: channel,        
    	username: username,
    	attachments: attach,
    	mrkdwn: true
    });

	return true;
};

var registered = function(channel, feed) {

	var attach = [];

	attach.push({
		color: "good",
		title: feed.name,
		title_link: feed.url
	})

	slack.send({
        text: "Registered *"+feed.name+"*",
		channel: channel,        
    	username: feed.username,
    	attachments: attach,
    	mrkdwn: true
    });

	return true;
};

var status = function(channel, feeds) {

	var attach = [];

	_.each(feeds, function(feed){
		var date = dateFormat(feed.lastCheck, "dd.mm.yy, hh:MM:ss TT");
		attach.push({
			color: "good",
			text: "Last checked: "+date+"",
			title: feed.name,
			title_link: feed.url
		})
	});

	slack.send({
        text: "Status for channel *"+channel+"*",
		channel: channel,        
    	username: "rss-tracker",
    	attachments: attach
    });


	return true;
}

exports.notify = notify;
exports.status = status;
exports.registered = registered;