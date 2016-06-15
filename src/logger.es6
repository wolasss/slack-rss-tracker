import fs from 'fs';
import {
    debug as DEBUG,
    logfile as LOGFILE
} from '../config.json';

let logToFile = function(message = "") {
    fs.appendFile(LOGFILE, message, (err) => {
        if (err) throw err;
    });
};

class Logger {
    constructor() {}

    log(message = "") {
        var date = new Date();
        var logMessage = `${date} - ${message}`;

        if (LOGFILE) logToFile(logMessage);
        if (DEBUG) console.log(logMessage);
    }
}

export default new Logger();