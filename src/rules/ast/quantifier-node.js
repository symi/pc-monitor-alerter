const Node = require("./node");

class QuantifierNode extends Node {
    constructor(value) {
        if (value !== "any" && value !== "all") {
            throw new Error(
                `Non quantifier passed to QuantifierNode: "${value}".`
            );
        }

        super(value);
    }
}

module.exports = QuantifierNode;
