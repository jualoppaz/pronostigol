describe("Main Controller", () => {
    var $controller, ctrl, mdSidenav, menuService, $templateCache;

    beforeEach(
        module("pronostigol", $provide => {
            mdSidenav = {
                open: () => {},
                close: () => {}
            };
            $provide.factory("$mdSidenav", () => {
                return direction => {
                    return mdSidenav;
                };
            });
        })
    );
    beforeEach(inject((_$controller_, _menuService_, _$templateCache_) => {
        $controller = _$controller_;
        menuService = _menuService_;
        $templateCache = _$templateCache_;

        ctrl = $controller("MainController", {
            menuService: menuService,
            $templateCache: $templateCache
        });
    }));

    it("#openMenu", () => {
        spyOn(mdSidenav, "open");
        ctrl.openMenu();
        expect(mdSidenav.open).toHaveBeenCalled();
    });

    it("#closeMenu", () => {
        spyOn(mdSidenav, "close");
        ctrl.closeMenu();
        expect(mdSidenav.close).toHaveBeenCalled();
    });
});
