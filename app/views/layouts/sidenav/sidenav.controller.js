"use strict";

function SidenavController(menuService, $transitions, $state) {
    var vm = this;
    vm.isMenuCollapsed = true;

    vm.sections = menuService.sections;

    function toggleOpen(section) {
        menuService.toggleSelectSection(section);
    }

    function onSuccess() {
        vm.isMenuCollapsed = true;
    }

    function onError() {
        vm.isMenuCollapsed = true;
    }

    function isOpen(section) {
        return menuService.isSectionSelected(section);
    }

    function isSelected(page) {
        return menuService.isPageSelected(page);
    }

    $transitions.onSuccess({}, onSuccess);
    $transitions.onError({}, onError);

    vm.isOpen = isOpen;
    vm.toggleOpen = toggleOpen;
    vm.isSelected = isSelected;
}

SidenavController.$inject = ["menuService", "$transitions", "$state"];
export default SidenavController;
