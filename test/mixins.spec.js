const { expect } = require("chai"),
    mock = require("mock-require"),
    mixins = require("../src/mixins"),
    path = require("path"),
    FakeClassFile = require("./mocks-helpers/FakeClass");

const pathToFakeSpy = path.resolve(__dirname, "./FakeClassSpy"),
    pathToFake = path.resolve(__dirname, "./FakeClass"),
    pathToNonClassFake = path.resolve(__dirname, "./FakeNonClass");

describe("Mixins - GetAndInstantiateMixin", () => {
    beforeEach(function() {
        this.FakeClassSpy = class FakeClassSpy {};
        this.FakeClass = class FakeClass {};
        this.sandbox.spy(this, "FakeClassSpy");
        mock(pathToFakeSpy, this.FakeClassSpy);
        mock(pathToFake, this.FakeClass);
        mock(pathToNonClassFake, "not a class");
    });

    afterEach(() => {
        this.FakeClass = undefined;
        mock.stopAll();
    });

    it("should add a private static method called _getAndInstantiate", () => {
        class Foo extends mixins.GetAndInstantiateMixin() {}

        expect(Foo).itself.to.respondTo("_getAndInstantiate");
    });

    it("should not effect the derived class and its prototype if no parent", () => {
        class Foo extends mixins.GetAndInstantiateMixin() {}

        expect(_ => new Foo()).not.to.throw();

        let foo = new Foo();

        expect(foo).to.be.an.instanceof(Foo);
    });

    it("should not effect the derived class and make it an instance of the parent if present", () => {
        class Bar {}
        class Foo extends mixins.GetAndInstantiateMixin(Bar) {}

        expect(_ => new Foo()).not.to.throw();

        let foo = new Foo();

        expect(foo).to.be.an.instanceof(Foo);
        expect(foo).to.be.an.instanceof(Bar);
    });

    it("should allow a derived class to call the mixin method in the ctor, dervied static and instance methods", function() {
        class Bar {
            undo() {
                return 0;
            }
        }

        class Foo extends mixins.GetAndInstantiateMixin(Bar) {
            constructor(n) {
                super();
                this.n = n;
                Foo._getAndInstantiate(pathToFakeSpy);
            }

            do() {
                Foo._getAndInstantiate(pathToFakeSpy);
                return this.n;
            }

            static doStatic() {
                Foo._getAndInstantiate(pathToFakeSpy);
            }
        }

        let foo = new Foo(1);
        Foo.doStatic();
        expect(foo.do()).to.equal(1);
        expect(this.FakeClassSpy.callCount).to.equal(3);
        expect(foo.undo()).to.equal(0);
    });

    describe("should get a file and instanciate that file with given ctor args", function() {
        it("when the path is an absolute path", function() {
            const Foo = mixins.GetAndInstantiateMixin();
            expect(Foo._getAndInstantiate(pathToFake)).to.be.an.instanceOf(
                this.FakeClass
            );
            Foo._getAndInstantiate(pathToFakeSpy, 1, "testarg2");
            expect(this.FakeClassSpy.calledWithExactly(1, "testarg2")).to.be
                .true;
        });

        it("when the path is a relative path (relative to calling -parent- file)", function() {
            const Foo = mixins.GetAndInstantiateMixin();
            expect(
                Foo._getAndInstantiate("./mocks-helpers/FakeClass")
            ).to.be.an.instanceOf(FakeClassFile);
        });
    });

    it("should fail silently and return undefined if no file exists or file doesn't contain an instanciatable default export", function() {
        const Foo = mixins.GetAndInstantiateMixin();
        expect(() => Foo._getAndInstantiate("./utterly/rubbish/path/to/file"))
            .not.to.throw;

        expect(
            Foo._getAndInstantiate("./utterly/rubbish/path/to/file")
        ).to.equal(undefined);

        expect(() => Foo._getAndInstantiate(pathToNonClassFake)).not.to.throw;
    });
});
