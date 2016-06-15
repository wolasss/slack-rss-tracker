import Logger from '../logger.es6';

class SubscribeCommand {
    constructor(RSS) {
        this.RSS = RSS;
        this.usage = "rss-tracker:subscribe [channel] [name] [url] [interval in min]";
    }

    execute(team, arg, cb) {
        const feed = {
            channel: arg[0],
            name: arg[1],
            url: arg[2],
            interval: parseInt(arg[3], 10) * (60 * 1000), //change to ms
            team: team
        };

        Logger.log(`Executing subscribe command for team ${team.name}`);
        this.RSS.register(team, feed, cb);
    }
}

export default SubscribeCommand;