var restify = require('restify');
var emitter;
var config  = require('./config.json');
var server = restify.createServer({
	name: "Slack rss tracker"
});

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
			if(fields.length < 6) {
				res.json({text: "rss-tracker:subscribe [channel] [name] [url] [username] [interval in ms]"});
				return next();
			}

			if(!fields[3].match(/^http/)) {
				res.json({text: "error: wrong url"});
				return next();
			}

			var interval = parseInt(fields[5], 10);

			if(isNaN(interval) || interval < 1800000) {
				res.json({text: "error: wrong interval, cannot be less than 1 800 000 ms (30min)"});
				return next();
			}

			emitter.emit("subscriptionRequest", fields[1], fields[2], fields[3], fields[4], fields[5]);
			res.json({});
			return next();
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