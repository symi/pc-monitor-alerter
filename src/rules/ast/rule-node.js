const Node = require("./node");

class RuleNode extends Node {
    constructor(value) {
        super(value);

        this.expression = value.expression;
        this.operator = value.operator;
        this.limit = value.value;
    }
}

module.exports = RuleNode;
