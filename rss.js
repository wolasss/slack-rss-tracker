var rsj = require('rsj');
var _ = require('underscore');
var emitter;
var feeds = [];

function getRandomInt(min, max) {
	return parseInt(Math.random() * (max - min) + min,10);
}

var check = function(feed) {
	rsj.r2j(feed.url, function(json) {
		if(json) {
			var arr;

			try {
				arr = JSON.parse(json);
			} catch(e) {
				return false;
			}

			for(var i=0, len=arr.length; i<len; i++) {
				if(arr[i].pubDate) {
					var feedDate = new Date(arr[i].pubDate);
					if(!feed.lastCheck || feedDate > feed.lastCheck) {
						emitter.emit("new", arr[i], feed);
					}
				}
			}
			feed.lastCheck = new Date();
		}
	});
};

var register = function(feed) {
	var interval;

	if(!feed.url) {
		throw new Error("No feed url specified");
	}

	if(!feed.channel) {
		throw new Error("No slack channel specified");
	}

	if(!feed.interval) {
		throw new Error("No interval specified");
	} else {
		interval = parseInt(feed.interval,10);
		if(isNaN(interval)) {
			throw new Error("interval is not a number");
		}
	}

	if(_.find(feeds, function(f){
		return (f.url === feed.url);
	})) {
		throw new Error("Feed already being watched");
	}

	if(!feed.name) {
		throw new Error("name not provided");
	}

	feed.lastCheck = new Date();
	interval += getRandomInt(15000, 60000); //prevent from checking multiple feeds in the same time
	feed.intervalId = setInterval(check, interval, feed);
	check(feed);

	feeds.push(feed);

	emitter.emit("registered", feed.channel, feed);
	return true;
};

var deregister = function(feed) {
	var url, name;
	if(!feed) {
		throw new Error("Feed not provided");
	}

	if(feed.match(/^http/)) {
		url = feed;
	} else {
		name = feed;
	}

	var found = _.find(feeds, function(f){
		return f.url == url || f.name == name;
	});

	if(!found) {
		throw new Error("Cannot find provided feed");
	} else {
		clearInterval(found.intervalId);

		feeds = _.reject(feeds, function(f){
			return f.url == url || f.name == name;
		});
	}
};

var status = function(channel) {
	if(!channel) {
		throw new Error("Channel not provided");
	}

	var channelFeeds = _.filter(feeds, function(f){
		return (f.channel === channel);
	});

	emitter.emit("status", channel, channelFeeds);

	return true;
};


module.exports = function(ee) {
    emitter = ee;
    emitter.on("statusRequest", status);

    return {
		register: register,
		deregister: deregister
    };
}