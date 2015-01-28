var config = require('./config.json');
var Slack = require('node-slack');
var slack = new Slack(config.slack.team, config.slack.token);

var notify = function(item, channel, name) {

	var attach = [];
	var html_regex = /(<([^>]+)>)/ig;

	//description
	attach.push({
		color: "good",
		text: item.description.replace(html_regex, ""),
		title: item.title,
		title_link: item.link
	})

	slack.send({
        text: ":mega: :mega: :mega: \n New post on *"+name+"*",
		channel: "test",        
    	username: "rss tracker",
    	attachments: attach,
    	mrkdwn: true
    });

}

exports.notify = notify;