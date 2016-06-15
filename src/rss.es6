import rsj from 'rsj';
import Logger from './logger.es6';
import {
    minInterval,
    maxNewItems
} from '../config.json';
import _ from 'lodash';

const getRandomInt = (min, max) => {
    return parseInt(Math.random() * (max - min) + min, 10);
};

class RSS {
    constructor(FeedStorage) {
        this.FeedStorage = FeedStorage;

        _.each(this.FeedStorage.getFeeds(), (feed) => {
            this.register(feed.team, feed);
        });
    }

    check(feed) {
        let counter = 0;

        rsj.r2j(feed.url, (json) => {
            if (json) {
                Logger.log(`Checking feed ${feed.url}`);
                var items;

                try {
                    items = JSON.parse(json);
                    _.each(items, (item) => {
                        if (item.pubDate) {
                            var itemDate = new Date(item.pubDate);

                            if ((!feed.lastCheck && counter < maxNewItems) || itemDate > feed.lastCheck) {
                                console.log("team: ", feed.team);
                                feed.team.notify(item, feed.channel, feed.name);
                                Logger.log(`New item ${item.title}`);
                                counter++;
                            }
                        }
                    });

                    feed.lastCheck = new Date();
                    this.FeedStorage.saveFeed(feed);
                } catch (e) {
                    Logger.log(`Error while checking: ${e.message}`);
                }
            }
        });
    }

    validateFeed(feed) {
        if (!feed.url) {
            throw new Error("No feed url specified");
        }

        if (!feed.channel) {
            throw new Error("No slack channel specified");
        }

        if (!feed.name) {
            throw new Error("Feed name not provided");
        }

        if (isNaN(parseInt(feed.interval, 10))) {
            throw new Error("interval is not a number");
        }

        if (feed.interval < minInterval * (60 * 1000)) {
            throw new Error(`Interval can't be less than ${minInterval}`);
        }
    }

    scheduleCheck(feed) {
        let interval = feed.interval;
        interval += getRandomInt(15000, 60000); //prevent from checking multiple feeds in the same time
        Logger.log(`Scheduling feed ${feed.url}: interval ${interval} ms`);
        feed.intervalId = setInterval(this.check.bind(this), interval, feed);
        this.check(feed);
    }

    clearInterval(feed) {
        if (!feed.intervalId) {
            throw new Error("The feed was not scheduled to check");
        }
        Logger.log(`Clearing feed schedule ${feed.url}`);

        clearInterval(feed.intervalId);
    }

    register(team, feed, cb = () => {}) {
        var interval;

        try {
            this.validateFeed(feed);
            this.scheduleCheck(feed);
            team.registerFeed(feed.channel, feed);
            cb(null, "Feed registered");
        } catch (e) {
            cb(e);
        }
    }

    unregister(team, feed, cb = () => {}) {
        var interval;

        try {
            this.clearInterval(feed);
            this.FeedStorage.removeFeed(feed.name, feed.team);
            cb(null, "Feed unregistered");
        } catch (e) {
            cb(e);
        }
    }

    checkStatus(team, channel, cb = () => {}) {
        let feeds = _.filter(this.FeedStorage.getFeeds(), (feed) => {
            return feed.channel === channel && feed.team && feed.team.name === team.name;
        }) || [];

        if (!feeds.length) {
            cb(new Error("There are no feeds in this channel"), null);
        } else {
            cb(!feeds.length, feeds);
        }
    }
}

export default RSS;