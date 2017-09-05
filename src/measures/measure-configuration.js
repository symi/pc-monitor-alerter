/**
 * Class representing the configuration required to create measure objects for items.
 * 
 * @class MeasureConfiguration
 */
class MeasureConfiguration {
    /**
     * Creates an instance of MeasureConfiguration.
     * @param {Array<string>} [measureNames=[]] The measure names to create.
     * @param {number} [historyCount=1] The number of data samples to keep in memory for each measure.
     * @param {Array<string>} [aggregates=[]] The aggregate names to create for each measure.
     * @memberof MeasureConfiguration
     */
    constructor(measureNames = [], historyCount = 1, aggregates = []) {
        this.measureNames = measureNames;
        this.historyCount = historyCount;
        this.aggregates = aggregates;
    }
}

module.exports = MeasureConfiguration;
