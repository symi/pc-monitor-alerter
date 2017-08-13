const moment = require("moment");

class Scheduler {
    constructor(time, interval) {
        if (!time && !interval) {
            return Scheduler.getBaseScheduler();
        }

        this._time = Scheduler._getTime(time);
        this._interval = interval || 86400; /* 1 day in seconds */
    }

    get time() {
        return this._time;
    }

    get interval() {
        return this._interval;
    }

    static getBaseScheduler() {
        return new Scheduler(
            moment({
                hours: 0,
                minutes: 0,
                seconds: 0
            }),
            60
        );
    }

    static _getTime(time) {
        if (!time) return moment();

        if (time instanceof moment) return time;

        const [hours, minutes, seconds] = time.split(":");
        return moment({
            hours,
            minutes,
            seconds
        });
    }
}

module.exports = Scheduler;
