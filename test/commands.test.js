import Commands from '../src/commands.es6';
import assert from 'assert';
import chai from 'chai';
import {
    expect
} from 'chai';

describe('Registering commands', () => {
    it('should properly register command', () => {
        var CommandsManager = new Commands([]);
        const testCommand = {
            execute: function() {}
        };
        CommandsManager.registerCommand('test', testCommand);
        expect(CommandsManager.getCommands().test).to.be.equal(testCommand);
    });

    it('should throw an error when name or command object are not specified', () => {
        expect(() => {
            CommandsManager.registerCommand();
        }).to.throw();

        expect(() => {
            CommandsManager.registerCommand("test");
        }).to.throw();

        expect(() => {
            CommandsManager.registerCommand(null, "test");
        }).to.throw();
    });
});

describe('Handling a command', () => {
    it('should properly call command execute method', () => {
        var CommandsManager = new Commands([]);
        const testCommand = {
            execute: function(team, arg, cb) {
                return cb.call(null, 1);
            }
        };
        CommandsManager.registerCommand('test', testCommand);
        CommandsManager.handleCommand('test', null, {}, (res) => {
            expect(res).to.be.equal(1);
        });
    });
});

describe('Extracting a command', () => {
    it('should properly extract a command name from a request', () => {
        var CommandsManager = new Commands([]);
        expect(CommandsManager.extractCommand('rss-tracker:subscribe test test http://test.com/feed/ 30')).to.be.equal('subscribe');
        expect(CommandsManager.extractCommand('rss-tracker:subscribe test')).to.be.equal('subscribe');
        expect(CommandsManager.extractCommand('rss-tracker:status')).to.be.equal('status');
    });
});

describe('Validating a token', () => {
    it('should validate a token and return a team', () => {
        const teams = [{
            name: 'a',
            token: 'a'
        }, {
            name: 'b',
            token: 'b'
        }];
        var CommandsManager = new Commands(teams);
        expect(CommandsManager.validateToken("a")).to.be.equal(teams[0]);
        expect(CommandsManager.validateToken("b")).to.be.equal(teams[1]);
    });

    it('should throw an error if token is invalid', () => {
        const teams = [{
            name: 'a',
            token: 'a'
        }, {
            name: 'b',
            token: 'b'
        }];
        var CommandsManager = new Commands(teams);

        expect(() => {
            CommandsManager.validateToken("c");
        }).to.throw();
    });
});

describe('Parsing a request', () => {
    it('should parse and execute corresponding command', () => {
        const teams = [{
            name: 'a',
            token: 'a'
        }, {
            name: 'b',
            token: 'b'
        }];

        const testCommand = {
            execute: function(team, arg, cb) {
                return cb.call(null, team, arg, 1);
            }
        };
        var CommandsManager = new Commands(teams);

        CommandsManager.registerCommand('test', testCommand);

        CommandsManager.parse("a", "rss-tracker:test arg1 arg2 arg3 arg4", (team, arg, res) => {
            expect(team).to.be.equal(teams[0]);
            expect(arg).to.be.a('array');
            expect(arg[0]).to.be.equal("arg1");
            expect(arg[1]).to.be.equal("arg2");
            expect(arg[2]).to.be.equal("arg3");
            expect(arg[3]).to.be.equal("arg4");
            expect(res).to.be.equal(1);
        });

        CommandsManager.parse("b", "rss-tracker:test 1", (team, arg, res) => {
            expect(team).to.be.equal(teams[1]);
            expect(arg).to.be.a('array');
            expect(arg[0]).to.be.equal("1");
            expect(res).to.be.equal(1);
        });
    });
});