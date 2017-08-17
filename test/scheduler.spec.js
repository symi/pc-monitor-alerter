const Scheduler = require("../src/scheduler"),
    moment = require("moment"),
    { expect } = require("chai");

describe("Scheduler", () => {
    it("the base scheduler should have a 10 minute interval", () => {
        let scheduler = Scheduler.getBaseScheduler();

        expect(scheduler.recurrence).to.equal("* */10 * * * *");
    });

    it("when instantiated with no rule (or empty string rule), should return the base scheduler", () => {
        let scheduler = new Scheduler(),
            emptyRuleScheduler = new Scheduler(""),
            baseScheduler = Scheduler.getBaseScheduler();

        expect(scheduler.recurrence).to.equal(baseScheduler.recurrence);
        expect(emptyRuleScheduler.recurrence).to.equal(
            baseScheduler.recurrence
        );
    });

    it("when instantiated with a valid rule, should use it", () => {
        let scheduler = new Scheduler("*/1 * * * * *");

        expect(scheduler.recurrence).to.equal("*/1 * * * * *");
    });

    it('when instantiated with an invalid rule, should throw', () => {
        let fn = () => {
            new Scheduler("*/1 this * * * *");
        };

        expect(fn).to.throw("Invalid recurrence rule for scheduler:");
    });
});
