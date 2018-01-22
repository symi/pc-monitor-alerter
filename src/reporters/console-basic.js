const Reporter = require("./reporter"),
    chalk = require("chalk");

class ConsoleBasic extends Reporter {
    constructor() {
        super();
    }

    report(watcher) {
        console.log(
            "\n\n" + chalk.gray("======================================") + "\n"
        );

        if (!watcher.items.length) {
            console.log(`${chalk.underline.redBright(watcher.itemName.toUpperCase())} - ${chalk.underline.redBright("NO-ITEM-DATA")}`);
        }

        watcher.items.forEach(item => {
            console.log(
                `${watcher.itemName} ${chalk.gray(
                    "("
                ) + item.identifier + chalk.gray(")")}`
            );
            item.measures.forEach(measure => {
                console.log(`   ${measure.name}`);

                if (!measure.records) {
                    console.log(
                        `       ${chalk.underline.redBright("NO-RECORD-DATA")}`
                    );
                    return;
                }

                for (let record of measure.records) {
                    let val =
                        record.value > 30 // TODO: have under, near and over states on record and aggregate.
                            ? chalk.bold.redBright(record.value)
                            : chalk.bold.greenBright(record.value);

                    let aggVals = record.aggregates
                        .reduce((output, aggregate) => {
                            let aggVal =
                                record.value > 30
                                    ? chalk.redBright(aggregate.value)
                                    : chalk.greenBright(aggregate.value);

                            output.push(
                                chalk.gray("(") +
                                    aggregate.name +
                                    " " +
                                    aggVal +
                                    chalk.gray(")")
                            );
                            return output;
                        }, [])
                        .join();

                    console.log(
                        `       ${chalk.bold(record.name)}  ${val}      ${aggVals}`
                    );
                }
            });
        });
    }
}

module.exports = ConsoleBasic;
