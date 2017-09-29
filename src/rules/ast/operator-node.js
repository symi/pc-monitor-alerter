const Node = require("./node");

class OperatorNode extends Node {
    constructor(value) {
        super(value);
        this.operatorFunction = this._getOperatorFunction();
    }

    _getOperatorFunction() {
        let operatorFunction;

        switch (this.value) {
            case "<":
                operatorFunction = (actual, limit) => actual < limit;
                break;
            case ">":
                operatorFunction = (actual, limit) => actual > limit;
                break;
            case "<=":
                operatorFunction = (actual, limit) => actual <= limit;
                break;
            case ">=":
                operatorFunction = (actual, limit) => actual >= limit;
                break;
            case "=":
                operatorFunction = (actual, limit) => actual === limit;
                break;
            case "!=":
                operatorFunction = (actual, limit) => actual !== limit;
                break;
            default:
                throw new Error(`Unknown operator: "${this.value}".`);
                break;
        }

        return operatorFunction;
    }
}

module.exports = OperatorNode;
