let Scheduler = require("../src/scheduler");
const moment = require("moment"),
    { expect } = require("chai"),
    mock = require("mock-require");

describe("Scheduler", () => {
    // TODO: much of this beforeEach should be moved out into a FakeScheduler util for other tests (they not stub out scheduler itself?).
    beforeEach(function() {
        let schedule = require("node-schedule");
        this.stubs = {};
        
        this.stubs.cancel = this.sandbox.spy();

        this.stubs.nextInvocation = this.sandbox.stub();
        this.stubs.nextInvocation.returns(new Date(2017, 0, 1));

        this.stubs.scheduleJob = this.sandbox.stub(schedule, "scheduleJob");
        this.stubs.scheduleJob.callsArg(1); // mock the scheduler call straight away.
        this.stubs.scheduleJob.returns({
            nextInvocation: this.stubs.nextInvocation,
            cancel: this.stubs.cancel
        });

        mock("node-schedule", schedule);

        // get scheduler using mocked node-schedule.
        Scheduler = mock.reRequire("../src/scheduler");
    });

    afterEach(function() {
        this.stubs = undefined;
        mock.stop("node-schedule");
        Scheduler = mock.reRequire("../src/scheduler"); // repopulate require cache with non mocked for future specs.
    });

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

    it("when instantiated with an invalid rule, should throw", () => {
        let fn = () => {
            new Scheduler("*/1 this * * * *");
        };

        expect(fn).to.throw("Invalid recurrence rule for scheduler:");
    });

    describe("when started", () => {
        it('should event out a "run" event when the schedule time occurs (twice, once when it scheduled and once at the very start)', function() {
            let scheduler = new Scheduler(),
                spy = this.sandbox.spy();
            // even tho it looks async, events are sync, so no need for async test.

            scheduler.on("run", spy);
            scheduler.start();
            expect(spy.callCount).to.equal(2);
        });

        it("should be scheduled to occur at the given recurrance rule", function() {
            let scheduler = new Scheduler();
            scheduler.start();

            expect(this.stubs.scheduleJob.calledWith(scheduler.recurrence)).to.be.true;
        });

        it("and then stopped, the started job should be cancelled", function() {
            let scheduler = new Scheduler();

            expect(() => {
                scheduler.stop();
            }).not.to.throw();

            this.stubs.cancel.reset(); // so we dont pollute the next expect.
            scheduler.start();
            scheduler.stop();
            expect(this.stubs.cancel.callCount).to.equal(1);
        });

        it("nextRun should return the next run timestamp (moment) if running, otherwise undefined", function() {
            let scheduler = new Scheduler();
            expect(scheduler.nextRun).to.equal(undefined);
            scheduler.start();

            // our fake date setup in beforeEach.
            expect(scheduler.nextRun.isSame(moment(new Date(2017, 0, 1)))).to.be
                .true;

            scheduler.stop();

            expect(scheduler.nextRun).to.equal(undefined);
        });
    });
});
