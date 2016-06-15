import Logger from '../logger.es6';

class StatusCommand {
    constructor(RSS) {
        this.RSS = RSS;
        this.usage = "rss-tracker:status [channel]";
    }

    execute(team, arg, cb) {
        const channel = arg[0];
        Logger.log(`Executing status command for team ${team.name}`);

        this.RSS.checkStatus(team, channel, (err, res) => {
            if (err) {
                cb.call(null, err);
            } else {
                team.sendFeedsStatus(channel, res, cb);
            }
        });
    }
}

export default StatusCommand;