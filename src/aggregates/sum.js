const Aggregate = require("./aggregate");

class Sum extends Aggregate {
    constructor() {
        super();
    }

    /**
     * Calculates the sum aggregate value of the record, counting each call by simply
     * using the base aggregate functionality and copying dataCount to value.
     *
     * @param {number} currentValue The current records value.
     * @param {number} [previousValue] The previous records value, can be undefied if first run or historic persistance count = 1.
     * @param {Aggregate} [previousAggregate] The previous records sum aggregate object, can be undefied if first run or historic persistance count = 1
     * @memberof Sum
     */
    calculate(currentValue, previousValue, previousAggregate) {
        super.calculate();
        this._value = this.dataCount;
    }
}

module.exports = Sum;
