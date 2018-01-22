const Aggregate = require("./aggregate");

class Mean extends Aggregate {
    constructor() {
        super('mean');
    }

    /**
     * Calculates the mean average aggregate value (μk) of the record, by using an incremental mean.
     * Using the current value (xk), previous mean (μk−1) and number of data points (k).
     * μk = μk−1 + ((xk − μk−1) / k)
     *
     * @param {number} currentValue The current records value.
     * @param {number} [previousValue] The previous records value, can be undefied if first run or historic persistance count = 1.
     * @param {Aggregate} [previousAggregate] The previous records mean aggregate object, can be undefied if first run or historic persistance count = 1
     * @memberof Mean
     */
    calculate(currentValue, previousValue, previousAggregate) {
        super.calculate();

        // if previousAggregate is undefined then we dont have history, so take this value as new mean.
        if (!previousAggregate) {
            this._value = currentValue;
        } else {
            this._value = previousAggregate.value + ((currentValue - previousAggregate.value) / this.dataCount);
        }
    }
}

module.exports = Mean;
