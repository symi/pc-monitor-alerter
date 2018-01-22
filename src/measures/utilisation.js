const Measure = require("./measure");

class Utilisation extends Measure {
    constructor(historyCount, aggregates) {
        super(historyCount, aggregates, "%", "utilisation");
    }
}

module.exports = Utilisation;