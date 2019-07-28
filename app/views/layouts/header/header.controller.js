"use strict";

function HeaderController($transitions) {
    var vm = this;
    vm.isMenuCollapsed = true;

    function onSuccess() {
        vm.isMenuCollapsed = true;
    }

    function onError() {
        vm.isMenuCollapsed = true;
    }

    $transitions.onSuccess({}, onSuccess);
    $transitions.onError({}, onError);
}

HeaderController.$inject = ["$transitions"];
export default HeaderController;
