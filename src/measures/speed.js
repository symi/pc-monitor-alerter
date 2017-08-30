const Measure = require("./measure");

class Speed extends Measure {
    // TODO: special case where where unit changes with item. special cased. code smell.
    constructor(unit = "MHz") {
        super(unit);
    }
}

module.exports = Speed;