const SwWatcher = require("../../src/watchers/sw-watcher"),
    { expect } = require("chai");

describe("HwWatcher", () => {
    describe("defaultAggregates static method", () => {
        const defaultVals = ["count", "delta", "detail", "last"];

        it("when called with no aggregates or empty array of aggregates should return all aggregates", () => {
            expect(SwWatcher.defaultAggregates()).to.have.members(defaultVals);
            expect(SwWatcher.defaultAggregates([])).to.have.members(
                defaultVals
            );
        });

        it('when called with "all" should return all aggregates', () => {
            expect(SwWatcher.defaultAggregates("all")).to.have.members(
                defaultVals
            );
            expect(SwWatcher.defaultAggregates(["all"])).to.have.members(
                defaultVals
            );
        });

        it("when called with a single aggregate should return that aggregate in an array", () => {
            expect(
                SwWatcher.defaultAggregates(defaultVals[0])
            ).to.have.members([defaultVals[0]]);
        });

        it("when called with a aggregates array, should just return that array", () => {
            expect(
                SwWatcher.defaultAggregates([defaultVals[0]])
            ).to.have.members([defaultVals[0]]);
        });
    });
});
