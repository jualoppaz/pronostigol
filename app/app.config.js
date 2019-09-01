"use strict";

// Layout
import mainCtrl from "./views/layouts/main/main.controller";
import sidenavCtrl from "./views/layouts/sidenav/sidenav.controller";
import footerCtrl from "./views/layouts/footer/footer.controller";

function configuration(
    $httpProvider,
    toastrConfig,
    $stateProvider,
    $urlRouterProvider,
    $mdThemingProvider
) {
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
            sidenav: {
                template: require("./views/layouts/sidenav/sidenav.html"),
                controller: sidenavCtrl,
                controllerAs: "sidenav"
            },
            main: {
                template: require("./views/layouts/main/main.html"),
                controller: mainCtrl,
                controllerAs: "main"
            },
            footer: {
                template: require("./views/layouts/footer/footer.html"),
                controller: footerCtrl,
                controllerAs: "footer"
            }
        },
        resolve: {},
        data: {}
    });

    $urlRouterProvider.otherwise("/");

    $mdThemingProvider.theme("site-toolbar").primaryPalette("grey", {
        default: "100"
    });
}

configuration.$inject = [
    "$httpProvider",
    "toastrConfig",
    "$stateProvider",
    "$urlRouterProvider",
    "$mdThemingProvider"
];

export default configuration;
