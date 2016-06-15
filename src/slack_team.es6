import {
    username
} from '../config.json';
import _ from 'lodash';
import DateFormat from 'dateformat';
import Logger from './logger.es6';
import request from 'request';


export default class SlackTeam {
    constructor(name, token, hook_url) {
        this.url = hook_url;
        this.token = token;
        this.name = name;

        Logger.log(`Creating a slack team - ${this.name}, ${this.token}`);
    }

    send(text, channel, attachments, cb = () => {}) {
        request.post(this.url, {
            form: {
                payload: JSON.stringify({
                    text,
                    channel,
                    username,
                    attachments,
                    mrkdwn: true
                })
            }
        }, (err, res, body) => {
            if (body !== "ok") {
                cb(new Error(`Cannot send message to slack channel: ${body}`));
            } else {
                cb(null, "ok");
            }
        });

        Logger.log(`Sending '${text}' for team ${this.name} for channel ${channel} with attachments ${attachments}`);
    }

    registerFeed(channel, feed, cb = () => {}) {
        this.send(`Registered *${feed.name}*`, channel, [{
            color: "good",
            title: feed.name,
            title_link: feed.url
        }], cb);
    }

    notify(item, channel, name, cb = () => {}) {
        this.send(`*${name}*`, channel, [{
            color: "good",
            text: item.description.replace(/(<([^>]+)>)/ig, ""),
            title: item.title,
            title_link: item.link
        }], cb);
    }

    sendFeedsStatus(channel, feeds, cb = () => {}) {
        let atts = [];

        _.each(feeds, function(feed) {
            var date = DateFormat(feed.lastCheck, "dd.mm.yy, hh:MM:ss TT");
            atts.push({
                color: "good",
                text: "Last checked: " + date + "",
                title: feed.name,
                title_link: feed.url
            });
        });

        this.send(`Status for channel ${channel}:`, channel, atts, cb);
    }
}