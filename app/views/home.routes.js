"use strict";

import homeCtrl from "./home.controller";

function routing($stateProvider) {
    $stateProvider.state("home", {
        url: "/",
        views: {
            "main@": {
                template: require("../views/home.html"),
                controller: homeCtrl,
                controllerAs: "home"
            }
        },
        parent: "layout",
        resolve: {}
    });
}

routing.$inject = ["$stateProvider"];
export default routing;
