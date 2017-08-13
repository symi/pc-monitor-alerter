const mixinPath = "../../src/mixins",
    mock = require("mock-require"),
    originalMixins = require(mixinPath);

class DefaultBase {}

let requires;

// note order matters on reRequires.
exports.setMock = function(returnFunction, ...reRequires) {
    mock(mixinPath, {
        ...originalMixins,
        GetAndInstantiateMixin: (Base = DefaultBase) =>
            class extends Base {
                static _getAndInstantiate(path, ...ctorArgs) {
                    return returnFunction(path, ...ctorArgs);
                }
            }
    });

    if (reRequires) {
        requires = reRequires;
        return reRequires.map(file => mock.reRequire(file));
    }
};

exports.removeMock = function() {
    mock.stop(mixinPath);
    if (requires) requires.map(file => mock.reRequire(file)); // refresh fileundertest and anyothers to not be using mock sub require
};
