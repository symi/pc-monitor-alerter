const ConfigEntity = require("../config-entity");

class Reporter extends ConfigEntity {
    constructor(name) {
        super(name);
    }

    report(watcher) {}
}

module.exports = Reporter;
