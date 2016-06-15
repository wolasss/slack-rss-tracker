import _ from 'lodash';
import {
    teams
} from '../config.json';
import SlackTeam from './slack_team.es6';
import Server from './server.es6';
import Commands from './commands.es6';
import FeedStorage from './feed_storage.es6';
import RSS from './rss.es6';
import STATUS_CMD from './commands/status.es6';
import SUBSCRIBE_CMD from './commands/subscribe.es6';

let _teams = [];
let server;

_.each(teams, (team) => {
    _teams.push(new SlackTeam(team.name, team.token, team.hook_url));
});

const CommandsMangaer = new Commands(_teams);
const FeedStorageManager = new FeedStorage(_teams);
const RssManager = new RSS(FeedStorageManager);

CommandsMangaer.registerCommand("status", new STATUS_CMD(RssManager));
CommandsMangaer.registerCommand("subscribe", new SUBSCRIBE_CMD(RssManager));

server = new Server(CommandsMangaer);
server.start();