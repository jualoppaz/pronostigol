"use strict";

import angular from "angular";
import toastr from "angular-toastr";
import ngAnimate from "angular-animate";
import ngMaterial from "angular-material";
import ngMessages from "angular-messages";

import configuration from "./app.config";

import directives from "./views/features/directives/directives.module";
import services from "./services/services.module";

// App Modules
import header from "./views/layouts/header/header.module";
import sidenav from "./views/layouts/sidenav/sidenav.module";
import footer from "./views/layouts/footer/footer.module";
import home from "./views/home.module";

// Vendor styles
import "angular-material/angular-material.css";

// Styles
import "./style.scss";

// Vendor modules
console.log(toastr);
console.log(ngAnimate);
console.log(ngMaterial);
console.log(ngMessages);

// App modules
console.log(header);
console.log(footer);
console.log(configuration);

angular
    .module("pronostigol", [
        directives,
        services,
        sidenav,
        header,
        footer,
        home,
        toastr,
        ngAnimate,
        ngMaterial,
        ngMessages
    ])
    .config(configuration)
    .run([
        "$rootScope",
        "$transitions",
        function($rootScope, $transitions) {
            $rootScope.$on("$stateChangeError", console.log.bind(console));

            function onStart() {
                $rootScope.loading = true;
            }

            function onSuccess(transition) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;

                $rootScope.currentState = transition.to().name;
                $rootScope.loading = false;
            }

            function onError() {}

            $transitions.onStart({}, onStart);

            $transitions.onSuccess({}, onSuccess);

            $transitions.onError({}, onError);
        }
    ]);

angular.element(document).ready(function() {
    console.log("Lanzamos la app");
    angular.bootstrap(document, ["pronostigol"]);
});

export default angular.module("pronostigol").name;
