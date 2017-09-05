const Measure = require("./measure");

class Temporature extends Measure {
    constructor(historyCount, aggregates) {
        super(historyCount, aggregates, "°C", "temporature");
    }
}

module.exports = Temporature;
