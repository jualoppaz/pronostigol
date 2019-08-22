"use strict";

function MainController(menuService, $templateCache, $mdSidenav) {
    var vm = this;

    $templateCache.put(
        "uiBreadcrumbs.html",
        require("./breadcrumbs/uiBreadcrumbs.tpl.html")
    );

    function toggleMenuFn() {
        $mdSidenav("left").toggle();
    }

    vm.currentPage = menuService.currentPage;
    vm.currentSection = menuService.currentSection;

    vm.toggleMenu = toggleMenuFn;
}

MainController.$inject = ["menuService", "$templateCache", "$mdSidenav"];
export default MainController;
