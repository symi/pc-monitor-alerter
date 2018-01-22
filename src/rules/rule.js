const nearley = require("nearley"),
    grammar = require("./grammar"),
    ast = require("./ast"),
    { compact } = require('lodash');

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
                // TODO: make all these logs/warns/throws consistent
                console.warn(err.message);
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

        const anyFunction = (arr, fn) => arr.some(fn), // TODO: because this bails early so doesnt mark all values as failed.
            allFunction = (arr, fn) => arr.every(fn),
            operatorFunction = this._ruleAST.operator.operatorFunction,
            limitValue = this._ruleAST.limit.value,
            expression = this._ruleAST.expression;

        let actualItems, actualMeasures, actualRecords, actualRecordsAndAggs;

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
        actualMeasures = compact(actualItems.map(item =>
            item.measures.find(
                measure => measure.name === expression.measure.value
            )
        ));

        // records
        actualRecords = actualMeasures.map(m => m.records);

        actualRecords = actualRecords.map(records => {
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
        actualRecordsAndAggs = actualRecords.map(records => {
            let values = [];
            for (let record of records) {
                if (expression.aggregate.value) {
                    let aggregate = record.aggregates.find(
                        aggregate =>
                            aggregate.name === expression.aggregate.value
                    );

                    if (aggregate) {
                        values.push(aggregate);
                    }
                } else {
                    values.push(record);
                }
            }

            return values;
        });

        // actually do the checking of values against limit
        // no values then always pass the rule to allow the report to show this
        return !actualRecordsAndAggs.length || instanceLogicalFunction(actualRecordsAndAggs, recordsAndAggs =>
            recordLogicalFunction(recordsAndAggs, recordOrAgg =>
                recordOrAgg.test(operatorFunction, limitValue))
        );
    }
}

module.exports = Rule;
