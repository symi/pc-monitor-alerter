const ConfigurationBuilder = require("../../src/configurations/configuration-builder"),
    Configuration = require("../../src/configurations/configuration"),
    { expect } = require("chai"),
    path = require("path");

// configbuilder doesnt do much, so more of an intergration test.
describe("ConfigurationBuilder", () => {
    it("when given a path should return the configuration", async () => {
        let cb = new ConfigurationBuilder(
            path.resolve(__dirname, "../../config/config.example.json")
        );
        let config = await cb.getConfiguration();
        expect(config).instanceof(Configuration);
    });
});
