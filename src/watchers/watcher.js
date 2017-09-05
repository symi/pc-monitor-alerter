const { GetAndInstantiateMixin } = require("../mixins");

class Watcher extends GetAndInstantiateMixin() {
    constructor(itemName, measureConfiguration) {
        super();
        this._itemName = itemName;
        this._measureConfiguration = measureConfiguration;
        this._items = [];
    }

    get itemName() {
        return this._itemName;
    }

    get items() {
        return this._items;
    }

    /**
     * The Items array of the watcher. Set via assigning a ItemConfiguration Array whic is
     * then deduped against existing items, to form the Item object array.
     * 
     * @type {Array<Items>}
     * @memberof Watcher
     */
    set items(itemConfigurations) {
        this._items.push(
            ...this._dedupeItems(itemConfigurations).map(itemConfiguration =>
                Watcher._getAndInstantiate(
                    `../items/${itemConfiguration.name}`,
                    itemConfiguration.identifier,
                    this._measureConfiguration
                )
            )
        );
    }

    getData(sources) {
        return undefined; // enforce derived classes implement.
    }

    /**
     * Removes all Items from a watcher. Useful for resetting items during a watchers
     * lifespan.
     * 
     * @memberof Watcher
     */
    clearItems() {
        this._items = [];
    }

    /**
     * Takes an array of ItemConfigurations and returns a new array of ItemConfigurations
     * minus any Items the watcher alread knows about. identifier prop is used for inference. 
     * 
     * @private
     * @param {Array<ItemConfiguration>} itemConfigurations The ItemConfigurations to dedupe.
     * @returns {Array<ItemConfiguration>} The deduped ItemConfigurations.
     * @memberof Watcher
     */
    _dedupeItems(itemConfigurations) {
        return itemConfigurations.filter(
            itemConfiguration =>
                !this.items.some(
                    item => item.identifier === itemConfiguration.identifier
                )
        );
    }
}

module.exports = Watcher;
