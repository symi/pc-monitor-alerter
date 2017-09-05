const ConfigEntity = require("../config-entity");

class Aggregate extends ConfigEntity {
    constructor(name) {
        super(name);
        this._value = undefined;
        this._dataCount = 0;
    }

    /**
     * Calculates the aggregate value for the current record.
     * Updates the dataCount property to be increased by 1 from the previous aggregate.
     * 
     * 
     * @param {any} currentValue The current records value.
     * @param {any} [previousValue] The previous records value, can be undefied if first run or historic persistance count = 1.
     * @param {Aggregate} [previousAggregate] The previous records matching aggregate object type, can be undefied if first run or historic persistance count = 1
     * @memberof Aggregate
     * @virtual
     */
    calculate(currentValue, previousValue, previousAggregate) {
        /* derived classes should implement setting of _value and call super() */
        if (!previousAggregate) {
            this._dataCount = 1;
        } else {
            this._dataCount = previousAggregate.dataCount + 1;
        }
    }

    /**
     * The current value of the aggregate.
     * 
     * @readonly
     * @memberof Aggregate
     */
    get value() {
        return this._value;
    }

    /**
     * The current data count value of the aggregate.
     * 
     * @readonly
     * @memberof Aggregate
     */
    get dataCount() {
        return this._dataCount;
    }
}

module.exports = Aggregate;
