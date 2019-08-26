"use strict";

function MainController(menuService, $templateCache, $mdSidenav) {
    var vm = this;

    $templateCache.put(
        "uiBreadcrumbs.html",
        require("./breadcrumbs/uiBreadcrumbs.tpl.html")
    );

    function openMenuFn() {
        $mdSidenav("left").open();
    }

    vm.currentPage = menuService.currentPage;
    vm.currentSection = menuService.currentSection;

    vm.openMenu = openMenuFn;
}

MainController.$inject = ["menuService", "$templateCache", "$mdSidenav"];
export default MainController;
