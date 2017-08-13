const Scheduler = require("../src/scheduler"),
    moment = require("moment"),
    { expect } = require("chai");

describe("Scheduler", () => {
    it("the base scheduler should have a 1 minute interval and time of midnight", () => {
        let scheduler = Scheduler.getBaseScheduler();

        expect(
            scheduler.time.isSame(moment({ hours: 0, minutes: 0, seconds: 0 }))
        ).to.be.true;

        expect(scheduler.interval).to.equal(60);
    });

    it("when instantiated with no time or interval, should return the base scheduler", () => {
        let scheduler = new Scheduler(),
            baseScheduler = Scheduler.getBaseScheduler();

        expect(scheduler.interval).to.equal(baseScheduler.interval);
        expect(scheduler.time.isSame(baseScheduler.time)).to.be.true;
    });

    it("when instantiated with a time and interval should use them (converting a string time to moment)", () => {
        let scheduler = new Scheduler("13:30:31", 120);

        expect(scheduler.interval).to.equal(120);
        expect(
            scheduler.time.isSame(
                moment({ hours: 13, minutes: 30, seconds: 31 })
            )
        ).to.be.true;
    });

    describe("the interval should be 1 day in seconds", () => {
        it("when instantiated with just a string format time", () => {
            let scheduler = new Scheduler("14:40:41");
            expect(scheduler.interval).to.equal(60 * 60 * 24);
            expect(
                scheduler.time.isSame(
                    moment({ hours: 14, minutes: 40, seconds: 41 })
                )
            ).to.be.true;
        });

        it("when instantiated with just a moment format time", () => {
            let time = moment().add(2, "hours"),
                scheduler = new Scheduler(time);
            expect(scheduler.interval).to.equal(60 * 60 * 24);
            expect(scheduler.time.isSame(time)).to.be.true;
        });
    });

    it("the time should be now, when instantiated with just an inteval", () => {
        let scheduler = new Scheduler(undefined, 38),
            now = moment(); // ran in same tick to time should be consistent as sync

        expect(scheduler.interval).to.equal(38);
        expect(
            scheduler.time.isSame(now, "seconds"),
            `expect ${scheduler.time.toISOString()} to be the same time as ${now.toISOString()}` // limiting granularity to 1 sec as ms can be different.
        ).to.be.true;
    });
});
