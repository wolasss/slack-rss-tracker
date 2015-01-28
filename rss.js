var rsj = require('rsj');
var _ = require('underscore');
var emitter;
var feeds = [];

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

	feed.intervalId = setInterval(check, parseInt(feed.interval,10), feed);

	feeds.push(feed);
}

module.exports = function(ee) {
    emitter = ee;
    return {
    	register: register,
    	check: check
    }
}