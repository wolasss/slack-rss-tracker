var config = require('./config.json');
var _ = require("underscore");
var dateFormat = require('dateformat');
var Slack = require('node-slack');
var slack = new Slack(config.slack.team, config.slack.token_in);

var send = function(text, channel, username, attachments) {

	slack.send({
		text: text,
		channel: channel,
		username: username,
		attachments: attachments,
		mrkdwn: true
	});

	return true;
};

var notify = function(item, channel, name, username) {
	var html_regex = /(<([^>]+)>)/ig;

	send("*"+name+"*", channel, username, [{
		color: "good",
		text: item.description.replace(html_regex, ""),
		title: item.title,
		title_link: item.link
	}]);

	return true;
};

var registered = function(channel, feed) {

	send("Registered *"+feed.name+"*", channel, feed.username, [{
		color: "good",
		title: feed.name,
		title_link: feed.url
	}]);

	return true;
};

var status = function(channel, feeds) {
	var attachs = [];

	_.each(feeds, function(feed){
		var date = dateFormat(feed.lastCheck, "dd.mm.yy, hh:MM:ss TT");
		attachs.push({
			color: "good",
			text: "Last checked: "+date+"",
			title: feed.name,
			title_link: feed.url
		});
	});

	send("Status for channel *"+channel+"*", channel, "rss-tracker", attachs);

	return true;
};

exports.notify = notify;
exports.status = status;
exports.registered = registered;