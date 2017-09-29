const ConfigEntity = require("../config-entity"),
    { GetAndInstantiateMixin } = require("../mixins"),
    Record = require("./record");

class Measure extends GetAndInstantiateMixin(ConfigEntity) {
    constructor(historyCount, aggregates, unitString, name) {
        super(name);
        this._allRecords = [];
        this._unit = unitString;
        this._historyCount = historyCount;
        this._aggregates = aggregates;
    }

    // TODO: record sets should be iterables returned.
    get records() {
        return this._allRecords[0]; // latest records is the first index.
    }

    set records(records) {
        // set aggregates before removing any historic data, as historyCount = 1 will
        // mean we lose data required to work out the aggregate.
        this._setAggregates(records);

        if (this._allRecords.length === this._historyCount) {
            this._allRecords.pop(); // remove the last (oldest record).
        }

        this._allRecords.unshift(records); // add latest record to the queue.
    }

    get allRecords() {
        return this._allRecords;
    }

    get unit() {
        return this._unit;
    }

    /**
     * Creates the aggregate objects for each record. Calculates the aggregate value,
     * and then sets the completed aggregate against the record.
     * 
     * @param {Array<Record>} records An array of records without aggregates present yet.
     * @memberof Measure
     */
    _setAggregates(records) {
        records.forEach((record, index) => {
            // get the previous corresponding record for the current record,
            // and create the new aggregate objects for the record.
            let previousRecord = this._getPreviousMatchingRecord(
                    record.name,
                    index
                ),
                recordAggregates = this._aggregates.map(aggregate =>
                    Measure._getAndInstantiate(`../aggregates/${aggregate}`)
                );

            // for each of the records aggregates work out the new aggregate value.
            // passing in useful information such as current value, previous records value
            // and the previous records matching aggregate type.
            recordAggregates.forEach(recordAggregate => {
                recordAggregate.calculate(
                    record.value,
                    previousRecord.value,
                    previousRecord.aggregates.find(
                        aggregate => aggregate.name === recordAggregate.name // TODO: instanceof check instead?
                    )
                );
            });

            // set the aggregates against the record.
            record.aggregates = recordAggregates;
        });
    }

    /**
     * Gets the previous record for the requested record name.
     * 
     * @param {string} name The name of the previous record to find.
     * @param {number} [indexHint] The index of the record in the previous data sample, used as a perf hint only.
     * @returns {Record} The found previous record for the name. If not found, an empty record is returned.
     * @memberof Measure
     */
    _getPreviousMatchingRecord(name, indexHint) {
        let previousRecords = this.allRecords[0],
            previousRecord;

        if (!Array.isArray(previousRecords)) {
            return new Record(); // bail early if no previousRecords, as no history.
        }

        // use hint if present, check the resulting records name for a match.
        if (indexHint != null) {
            previousRecord = previousRecords[indexHint];

            if (previousRecord.name === name) {
                return previousRecord;
            }
        }

        // if not found yet, search all records.
        return (
            previousRecords.find(record => record.name === name) || new Record()
        );
    }
}

module.exports = Measure;
