import _ from 'lodash';
import Logger from './logger.es6';

let _teams = [];
let _commands = {
    "help": {
        execute: (team, arg, cb) => {
            let attachments = [];
            _.each(_commands, (cmd) => {
                attachments.push({
                    color: "#28d7e5",
                    text: cmd.usage,
                    title: cmd.name
                });
            });
            team.send('Possible rss-tracker commands', null, attachments, cb);
        }
    }
};

let Commands = class {
    constructor(teams) {
        _teams = teams;
    }

    extractCommand(text = "") {
        var commands = text.match(/rss-tracker:(\w+)/);

        if (!commands || commands.length <= 1) {
            throw new Error("Cannot parse the command");
        }

        return commands[1];
    }

    validateToken(token) {
        if (!token) throw new Error("Token not provided");

        var team = _.find(_teams, {
            token
        });
        if (!team) throw new Error("Token is not valid");

        return team;
    }

    parse(token, text, cb = () => {}) {
        var command, arg, channel, team;

        try {
            command = this.extractCommand(text);
            team = this.validateToken(token);
            arg = text.split(" ").slice(1);
            this.handleCommand(command, arg, team, cb);
        } catch (e) {
            cb(e);
        }
    }

    handleCommand(command, arg, team, cb = () => {}) {
        Logger.log(`Handling ${command} with arguments ${arg} for team ${team.name}`);
        if (command && _commands[command]) {
            _commands[command].execute(team, arg, cb);
        } else {
            throw new Error("Command not known");
        }
    }

    registerCommand(name, command) {
        if (!name || !command) {
            throw new Error("Teams not defined");
        }
        _commands[name] = command;
    }

    getTeams() {
        return _teams;
    }

    getCommands() {
        return _commands;
    }
};

export default Commands;