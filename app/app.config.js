"use strict";

// Layout
import headerCtrl from "./views/layouts/header/header.controller";
import sidenavCtrl from "./views/layouts/sidenav/sidenav.controller";
import footerCtrl from "./views/layouts/footer/footer.controller";

function configuration(
    $httpProvider,
    toastrConfig,
    $stateProvider,
    $urlRouterProvider
) {
    console.log("Entramos en el config");
    $httpProvider.defaults.withCredentials = true;

    angular.extend(toastrConfig, {
        autoDismiss: false,
        closeButton: true,
        containerId: "toast-container",
        maxOpened: 0,
        newestOnTop: true,
        preventDuplicates: false,
        preventOpenDuplicates: true,
        target: "body"
    });

    $stateProvider.state("layout", {
        url: "",
        abstract: true,
        views: {
            header: {
                template: require("./views/layouts/header/header.html"),
                controller: headerCtrl,
                controllerAs: "header"
            },
            sidenav: {
                template: require("./views/layouts/sidenav/sidenav.html"),
                controller: sidenavCtrl,
                controllerAs: "sidenav"
            },
            footer: {
                template: require("./views/layouts/footer/footer.html"),
                controller: footerCtrl,
                controllerAs: "footer"
            }
        },
        resolve: {}
    });

    $urlRouterProvider.otherwise("/");
}

configuration.$inject = [
    "$httpProvider",
    "toastrConfig",
    "$stateProvider",
    "$urlRouterProvider"
];

export default configuration;
