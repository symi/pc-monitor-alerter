/**
 * Class representing a key value pair of name and data.
 * multiple Records can make up a data sample for a Measure.
 * 
 * @class Record
 */
class Record {
    /**
     * Creates an instance of Record.
     * @param {string} name 
     * @param {any} value 
     * @memberof Record
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this._aggregates = [];
    }

    /**
     * Returns the aggregates for the record.
     * 
     * @memberof Record
     */
    get aggregates() {
        return this._aggregates;
    }

    /**
     * Sets the aggregates for the record. Once set, aggregates can not be changed. 
     * 
     * @memberof Record
     */
    set aggregates(aggregates = []) {
        if (this._aggregates.length) {
            throw new Error(`Aggregate already set on record, ${this.name}.`);
        }

        this._aggregates = aggregates;
    }
}

module.exports = Record;
