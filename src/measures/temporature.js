const Measure = require("./measure");

class Temporature extends Measure {
    constructor(identifier, value) {
        super(identifier, value, "°C");
    }
}

module.exports = Temporature;