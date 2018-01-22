const Aggregate = require("./aggregate");

class Min extends Aggregate {
    constructor() {
        super('min');
    }

    /**
     * Calculates the minimum aggregate value of the record, comparing current value,
     * to previous minimum aggregate value.
     *
     * @param {number} currentValue The current records value.
     * @param {number} [previousValue] The previous records value, can be undefied if first run or historic persistance count = 1.
     * @param {Aggregate} [previousAggregate] The previous records Min aggregate object, can be undefied if first run or historic persistance count = 1
     * @memberof Min
     */
    calculate(currentValue, previousValue, previousAggregate) {
        // if previousAggregate is undefined then we dont have history, so take this value as new min.
        if (!previousAggregate) {
            this._value = currentValue;
        } else {
            this._value = Math.min(currentValue, previousAggregate.value);
        }

        // no super call as we dont care about datacount in Min aggregate.
    }
}

module.exports = Min;
