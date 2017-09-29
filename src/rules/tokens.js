module.exports = {
    identifier: {
        match: /(?:'|").+?(?:'|")/,
        value: x => x.replace(/("|')/g, "")
    },
    aggregate: ["min", "average", "max", "delta"],
    measure: ["temperature", "usage", "speed"],
    item: /(?:cpu|gpu)s?/,
    sensor: /sensors?/,
    quantifier: ["any", "all"],
    operator: [">", "<", "<=", ">=", "!=", "="],
    punctuation: [",", ".", ";"],
    nonzeronumber: /[0-9]*[1-9][0-9]*/,
    number: /[0-9]+/,
    word: /[\S]+/,
    WS: { match: /\s+/, lineBreaks: true }
};
