"use strict";

function MainController(menuService, $templateCache, $mdSidenav, $transitions) {
    var vm = this;

    $templateCache.put(
        "uiBreadcrumbs.html",
        require("./breadcrumbs/uiBreadcrumbs.tpl.html")
    );

    function openMenuFn() {
        $mdSidenav("left").open();
    }

    function closeMenuFn() {
        $mdSidenav("left").close();
    }

    vm.currentPage = menuService.currentPage;
    vm.currentSection = menuService.currentSection;

    vm.openMenu = openMenuFn;

    $transitions.onSuccess({}, closeMenuFn);
}

MainController.$inject = [
    "menuService",
    "$templateCache",
    "$mdSidenav",
    "$transitions"
];
export default MainController;
