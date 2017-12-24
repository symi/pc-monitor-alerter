const nearley = require("nearley"),
    grammar = require("./grammar"),
    ast = require("./ast");

class Rule {
    constructor(ruleText) {
        this._text = ruleText;

        if (ruleText) {
            this._parser = new nearley.Parser(
                nearley.Grammar.fromCompiled(grammar)
            );
            try {
                this._parser.feed(ruleText.toLowerCase());
                this._ruleAST = this._parser.results[0];
            } catch (err) {
                // TODO: happy with this?
                // if rule errors we say the reporter has no rules... atm anyway... might change
                this._text = null;
                console.log(err);
            }
        }
    }

    get text() {
        return this._text;
    }

    // TODO: split this up logically...
    test(watcher) {
        // if no rule we can skip the check, as anything is allowed.
        if (!this._text) {
            return true;
        }

        const anyFunction = (arr, fn) => arr.some(fn),
            allFunction = (arr, fn) => arr.every(fn),
            operatorFunction = this._ruleAST.operator.operatorFunction,
            limitValue = this._ruleAST.limit.value,
            expression = this._ruleAST.expression;

        let actualItems, actualMeasures, actualRecords, actualValues;

        let instanceLogicalFunction, recordLogicalFunction;

        // item instances
        switch (expression.instance.constructor) {
            case ast.QuantifierNode:
                actualItems = watcher.items;

                if (expression.instance.value === "any")
                    instanceLogicalFunction = anyFunction;
                else instanceLogicalFunction = allFunction;
                break;
            case ast.NumberNode:
                instanceLogicalFunction = allFunction;
                actualItems = [watcher.items[expression.instance.value - 1]];
                break;
            case ast.TextNode:
                actualItems = watcher.items.filter(
                    item => item.identifer === expression.instance.value
                );
                instanceLogicalFunction = allFunction;
                break;
            default:
                throw new Error(
                    `Unknown instance type, "${expression.instance.constructor
                        .name}".`
                );
                break;
        }

        // measures
        actualMeasures = actualItems.map(item =>
            item.measures.find(
                measure => measure.name === expression.measure.value
            )
        );

        // records
        actualRecords = actualMeasures.map(m => m.records);

        actualRecords.map(records => {
            let filteredRecords = [];

            switch (expression.record.constructor) {
                case ast.QuantifierNode:
                    filteredRecords = records;

                    if (expression.record.value === "any")
                        recordLogicalFunction = anyFunction;
                    else recordLogicalFunction = allFunction;
                    break;
                case ast.TextNode:
                    for (let record of records) {
                        if (record.name === expression.record.value) {
                            filteredRecords.push(record);
                        }
                    }

                    recordLogicalFunction = allFunction;
                    break;
                default:
                    throw new Error(
                        `Unknown record type, "${expression.record.constructor
                            .name}".`
                    );
                    break;
            }

            return filteredRecords;
        });

        // value/aggregate value
        actualValues = actualRecords.map(records => {
            let values = [];
            for (let record of records) {
                if (expression.aggregate.value) {
                    let aggregate = record.aggregates.find(
                        aggregate =>
                            aggregate.name === expression.aggregate.value
                    );

                    if (aggregate) {
                        values.push(aggregate.value);
                    }
                } else {
                    values.push(record.value);
                }
            }

            return values;
        });

        // actually do the checking of values against limit
        return instanceLogicalFunction(actualValues, recordValues =>
            recordLogicalFunction(recordValues, value =>
                operatorFunction(value, limitValue)
            )
        );
    }
}

module.exports = Rule;
