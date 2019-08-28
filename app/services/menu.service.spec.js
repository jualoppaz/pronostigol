describe("Menu Service", function() {
    var service;

    beforeEach(module("pronostigol"));
    beforeEach(inject(function(_menuService_) {
        service = _menuService_;
    }));

    it("#selectSection", function() {
        const section = {
            name: "Sorteos",
            state: "quiniela.tickets",
            url: "/sorteos",
            type: "link"
        };
        service.selectSection(section);

        const openedSection = service.getOpenedSection();

        expect(openedSection).toEqual(section);
    });
});
