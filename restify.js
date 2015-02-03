var restify = require('restify');
var emitter;
var config  = require('./config.json');
var server = restify.createServer({
	name: "Slack rss tracker"
});
var fs = require('fs');
var filename = 'feeds.json';



var port = parseInt(config.port,10);

server.use(restify.bodyParser()); //reading payload
server.use(restify.queryParser()); //reading query
server.pre(restify.pre.sanitizePath());

server.post('/tracker', function(req, res, next){
	if(req.params.token !== config.slack.token_out) {
		res.json({text: 'token is invalid'});
	}

	var commandMatch = req.params.text.match(/rss-tracker:(\w+)/);
	var command;
	if(commandMatch && commandMatch.length>1) {
		command = commandMatch[1];
		var fields = req.params.text.split(" ");
		var channel = ( fields[1] ? fields[1] : req.params.channel_name);
			
		if(command == "status") {

			emitter.emit("statusRequest", channel);
			res.json({});
			return next();
		}

		if(command == "subscribe") {
			if(fields.length < 5) {
				res.json({text: "rss-tracker:subscribe [channel] [name] [url] [interval in min]"});
				return next();
			} else {
				var url = fields[3].match(/^\<?(http[^>]+)/);

				if(!url) {
					res.json({text: "error: wrong url"});
					return next();
				}

				var interval = parseInt(fields[4], 10);

				if(isNaN(interval) || interval < 30) {
					res.json({text: "error: wrong interval, cannot be less than 30min"});
					return next();
				}

				emitter.emit("subscriptionRequest", fields[1], fields[2], url[1], interval*60000);
				res.json({});
				return next();
			}
		}
	}

	res.json({text: 'command is unknown'});
	return next();
});


server.listen(port, function(){
	console.log("%s running on %s (%s)", server.name, server.url, server.log.fields.hostname);
});


module.exports = function(ee) {
    emitter = ee;
};