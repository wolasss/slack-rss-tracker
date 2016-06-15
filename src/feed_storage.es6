import fs from 'fs';
import feeds from '../feeds.json';
import _ from 'lodash';
import Logger from './logger.es6';

var _feeds = [];

class FileStorage {
    constructor(teams) {
        this._teams = teams;

        _.each(feeds.rss, (feed) => {
            feed.team = _.find(this._teams, {
                name: feed.team
            });

            if (feed.lastCheck) {
                feed.lastCheck = new Date(feed.lastCheck);
            }

            _feeds.push(feed);
        });
    }

    getFeeds() {
        return _feeds;
    }

    getFeed(name) {
        return _.find(_feeds, {
            name
        });
    }

    saveFeeds() {
        fs.writeFileSync('feeds.json', JSON.stringify({
            rss: _.map(_feeds, (feed) => {
                let ret = _.omit(feed, 'intervalId');
                ret.team = ret.team.name;
                return ret;
            })
        }, null, 4));
        Logger.log(`Dumping feeds`);
    }

    saveFeed(feed) {
        Logger.log(`Saving feed ${feed.name}`);
        var feeds = _.reject(_feeds, (f) => {
            return f.name === feed.name && f.team.name === feed.team.name && feed.url === f.url;
        });
        feeds.push(feed);
        _feeds = feeds;
        this.saveFeeds();
    }

    removeFeed(name) {
        if (getFeed(name)) {
            _feeds = _.without(_feeds, {
                name
            });
            this.saveFeeds();
        }
    }
}

export default FileStorage;