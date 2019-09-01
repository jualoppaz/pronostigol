describe("Main Controller", function() {
    var $controller, ctrl, mdSidenav, menuService, $templateCache;

    beforeEach(
        module("pronostigol", function($provide) {
            mdSidenav = {
                open: function() {},
                close: function() {}
            };
            $provide.factory("$mdSidenav", function() {
                return function(direction) {
                    return mdSidenav;
                };
            });
        })
    );
    beforeEach(inject(function(_$controller_, _menuService_, _$templateCache_) {
        $controller = _$controller_;
        menuService = _menuService_;
        $templateCache = _$templateCache_;

        ctrl = $controller("MainController", {
            menuService: menuService,
            $templateCache: $templateCache
        });
    }));

    it("#openMenu", function() {
        spyOn(mdSidenav, "open");
        ctrl.openMenu();
        expect(mdSidenav.open).toHaveBeenCalled();
    });

    it("#closeMenu", function() {
        spyOn(mdSidenav, "close");
        ctrl.closeMenu();
        expect(mdSidenav.close).toHaveBeenCalled();
    });
});
