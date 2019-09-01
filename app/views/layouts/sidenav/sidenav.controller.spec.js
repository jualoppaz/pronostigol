describe("Sidenav Controller", () => {
    var $controller, ctrl, menuService, $state, $rootScope, $transitions;

    beforeEach(module("pronostigol"));
    beforeEach(inject((
        _$controller_,
        _menuService_,
        _$state_,
        _$rootScope_,
        _$transitions_
    ) => {
        $controller = _$controller_;
        menuService = _menuService_;
        $state = _$state_;
        $rootScope = _$rootScope_;
        $transitions = _$transitions_;

        ctrl = $controller("SidenavController", {
            menuService: menuService
        });
    }));

    it("#isOpen", () => {
        spyOn(menuService, "isSectionSelected");

        const section = {
            name: "Sorteos",
            state: "quiniela.tickets",
            url: "/sorteos",
            type: "link"
        };

        ctrl.isOpen(section);
        expect(menuService.isSectionSelected).toHaveBeenCalledWith(section);
    });

    it("#isSelected", () => {
        spyOn(menuService, "isPageSelected");

        const page = {
            name: "Sorteos",
            state: "quiniela.tickets",
            url: "/sorteos",
            type: "link"
        };

        ctrl.isSelected(page);
        expect(menuService.isPageSelected).toHaveBeenCalledWith(page);
    });

    it("#toggleOpen", () => {
        spyOn(menuService, "toggleSelectSection");

        const section = {
            name: "Sorteos",
            state: "quiniela.tickets",
            url: "/sorteos",
            type: "link"
        };

        ctrl.toggleOpen(section);
        expect(menuService.toggleSelectSection).toHaveBeenCalledWith(section);
    });

    // Transition Hooks

    it("#onSuccess", done => {
        spyOn($transitions, "onSuccess");
        ctrl.isMenuCollapsed = false;
        $state.go("quiniela.stats");
        $rootScope.$apply();

        expect(ctrl.isMenuCollapsed).toBeTruthy();
        done();
    });

    it("#onError", done => {
        spyOn($transitions, "onSuccess");
        ctrl.isMenuCollapsed = false;
        $state.go("quiniela.stats");
        $rootScope.$apply();

        expect(ctrl.isMenuCollapsed).toBeTruthy();
        done();
    });
});
