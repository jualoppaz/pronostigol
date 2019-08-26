"use strict";

import homeCtrl from "./home.controller";

function routing($stateProvider) {
    $stateProvider.state("home", {
        url: "/",
        views: {
            "content@layout": {
                template: require("./home.html"),
                controller: homeCtrl,
                controllerAs: "home"
            }
        },
        parent: "layout",
        resolve: {},
        data: {
            displayName: "Inicio"
        }
    });
}

routing.$inject = ["$stateProvider"];
export default routing;
