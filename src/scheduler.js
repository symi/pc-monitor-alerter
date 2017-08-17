const moment = require("moment"),
    schedule = require("node-schedule"),
    cronParser = require("cron-parser"),
    EventEmitter = require("events");

class Scheduler extends EventEmitter {
    constructor(recurrenceStatement) {
        super();

        if (recurrenceStatement) {
            try {
                cronParser.parseExpression(recurrenceStatement);
            } catch (err) {
                throw new Error(`Invalid recurrence rule for scheduler: "${recurrenceStatement}".
Parse Error: "${err.message}".`);
            }
        } else {
            return Scheduler.getBaseScheduler();
        }

        this._recurrence = recurrenceStatement;
    }

    get recurrence() {
        return this._recurrence;
    }

    

    static getBaseScheduler() {
        return new Scheduler("* */10 * * * *");
    }
}

module.exports = Scheduler;
