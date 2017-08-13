const ConfigurationReader = require("../../src/configurations/configuration-reader"),
    { expect } = require("chai"),
    path = require("path");

// configbuilder doesnt do much, so more of an intergration test.
describe("ConfigurationReader", () => {
    it("when given a path should check to see if there is a config file present", () => {
        expect(
            _ =>
                new ConfigurationReader(
                    path.resolve(__dirname, "../../config/config.example.json")
                )
        ).not.to.throw();

        expect(
            _ =>
                new ConfigurationReader(
                    path.resolve(
                        __dirname,
                        "../../config/rubbish.config.example.json"
                    )
                )
        ).to.throw();
    });

    describe("instanciated with a valid config file", () => {
        it("should return the config in json format", async () => {
            let cr = new ConfigurationReader(
                    path.resolve(__dirname, "../../config/config.example.json")
                ),
                output = await cr.read();

            expect(output).to.exist;
            expect(output).to.have.property("scheduler"); // good enough to check for presence of 1 property.
        });
    });
});
