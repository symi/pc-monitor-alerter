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

    get nextRun() {
        if (this._job && this._job.nextInvocation()) {
            return moment(this._job.nextInvocation());
        }
    }

    start() {
        this._invoke(); // kick off an initial invokation, then schedule future.
        this._job = schedule.scheduleJob(this._recurrence, this._invoke.bind(this));
    }

    stop() {
        if (this._job) {
            this._job.cancel();
            this._job = undefined;
        }
    }

    _invoke() {
        this.emit("run");
    }

    static getBaseScheduler() {
        return new Scheduler("* */10 * * * *");
    }
}

module.exports = Scheduler;
