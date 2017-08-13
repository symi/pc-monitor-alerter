const caller = require("caller"),
    { dirname, resolve } = require("path");

class DefaultBase {}

exports.GetAndInstantiateMixin = (Base = DefaultBase) =>
    class extends Base {
        static _getAndInstantiate(path, ...ctorArgs) {
            let ob,
                resolvedPath = resolve(dirname(caller()), path);

            try {
                ob = new (require(resolvedPath))(...ctorArgs);
            } catch (e) {
                //throw new Error(`Missing Class for path "${path}".`);
            }

            return ob;
        }
    };
