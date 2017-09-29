const Measure = require("./measure");

class Temperature extends Measure {
    constructor(historyCount, aggregates) {
        super(historyCount, aggregates, "°C", "temperature");
    }
}

module.exports = Temperature;
