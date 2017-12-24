const Aggregate = require("./aggregate");

class Delta extends Aggregate {
    constructor() {
        super();
    }

    /**
     * Calculates the delta aggregate value of the record, comparing current value,
     * to previous value, calculating the change in value.
     *
     * @param {number} currentValue The current records value.
     * @param {number} [previousValue] The previous records value, can be undefied if first run or historic persistance count = 1.
     * @param {Aggregate} [previousAggregate] The previous records delta aggregate object, can be undefied if first run or historic persistance count = 1
     * @memberof Delta
     */
    calculate(currentValue, previousValue, previousAggregate) {
        // if previousAggregate is undefined then we dont have history, so report no change.
        // a large delta change could trigger an erroneous rule pass.
        if (!previousValue) {
            this._value = 0;
        } else {
            this._value = currentValue - previousValue;
        }

        // no super call as we dont care about datacount in delta aggregate.
    }
}

module.exports = Delta;
