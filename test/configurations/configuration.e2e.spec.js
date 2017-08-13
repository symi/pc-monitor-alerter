//TODO: finish this test
xdescribe("Configuration", () => {
    function testScheduler(actualScheduler, expectedInterval, expectedTime) {
        expect(actualScheduler.interval).to.equal(expectedInterval);
        expect(
            actualScheduler.time.isSame(expectedTime, "seconds"),
            `expect ${actualScheduler.time.toISOString()} to be the same time as ${expectedTime.toISOString()}` // limiting granularity to 1 sec as ms can be different.
        ).to.be.true;
    }

    it("should make the config (EPIC)", function() {
        removeMock(); // clear our mocks we are performing an integration e2e test here

        let c = new Configuration(this.example),
            sources;

        // default scheduler
        testScheduler(
            c.defaultScheduler,
            2,
            moment({ hours: 15, minutes: 30, seconds: 1 })
        );

        //default sources
        sources = [
            "open-hw-mon-wmi",
            "sys-info",
            "os",
            "avira-wmi",
            "diskusage",
            "win-event"
        ];
        expect(c.defaultSources).to.have.lengthOf(sources.length);

        sources.forEach((sourceString, index) => {
            expect(c.defaultSources[index].name).to.equal(sourceString);
        });
    });
});
