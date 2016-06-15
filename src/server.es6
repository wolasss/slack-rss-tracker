import Hapi from 'hapi';
import Logger from './logger.es6';
import {
    port as PORT,
    slack
} from '../config.json';

class Server {
    constructor(Commands) {
        this.server = new Hapi.Server();
        this.Commands = Commands;

        this.server.connection({
            port: PORT
        });
        this.registerRoutes();
    }

    registerRoutes() {
        this.server.route({
            method: 'POST',
            path: '/tracker',
            handler: (request, reply) => {
                Logger.log(`Request from ${request.payload.token} : ${request.payload.text}`);

                this.Commands.parse(request.payload.token, request.payload.text, (err, res) => {
                    if (err) {
                        Logger.log(`Error: ${err.message}`);
                        reply({
                            text: `Error: ${err.message}`
                        });
                    } else {
                        reply({
                            text: res
                        });
                    }
                });
            }
        });
        Logger.log(`Routes registered`);
    }

    start() {
        this.server.start((err) => {
            if (!err) Logger.log(`Server is running on ${this.server.info.uri}`);
        });
    }
}


export default Server;