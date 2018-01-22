const Measure = require("./measure");

class Speed extends Measure {
    // TODO: special case where where unit changes with item. special cased. code smell.
    constructor(historyCount, aggregates) {
        super(historyCount, aggregates, "MHz", "speed");
    }
}

module.exports = Speed;