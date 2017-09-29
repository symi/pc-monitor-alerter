const { GetAndInstantiateMixin } = require("../mixins"),
    Rule = require("../rules/rule");

class ReporterConfiguration extends GetAndInstantiateMixin() {
    constructor(reporter, rule) {
        super();
        this._reporter = ReporterConfiguration._getAndInstantiate(
            `./${reporter}`
        );
        this._rule = new Rule(rule);
    }

    get reporter() {
        return this._reporter;
    }

    get rule() {
        return this._rule;
    }
}

module.exports = ReporterConfiguration;
