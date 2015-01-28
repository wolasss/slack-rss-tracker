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
			try {
				var arr = JSON.parse(json);
			} catch(e) {
				return false;
			}

			for(var i=0, len=arr.length; i<len; i++) {
				if(arr[i].pubDate) {
					var feedDate = new Date(arr[i].pubDate)
					if(!feed.lastCheck || feedDate > feed.lastCheck) {
						emitter.emit("new", arr[i], feed);
					}
				}
			}
			feed.lastCheck = new Date();
		}
	});
}

var register = function(feed) {
	var interval;

	if(!feed.url) {
		throw new Error("No feed url specified");
	}

	if(!feed.channel) {
		throw new Error("No feed slack channel specified");
	}

	if(!feed.interval) {
		throw new Error("No feed interval specified");
	}

	if(_.contains(feeds, function(f){
		return (f.url === feed.url)
	})) {
		throw new Error("Feed already being watched");
	}

	if(!feed.name) {
		throw new Error("name not provided");
	}
	feed.lastCheck = new Date();
	interval = parseInt(feed.interval,10)+getRandomInt(15000, 60000);
	feed.intervalId = setInterval(check, interval, feed);
	check(feed);

	feeds.push(feed);
}

module.exports = function(ee) {
    emitter = ee;
    return {
    	register: register,
    	check: check
    }
}