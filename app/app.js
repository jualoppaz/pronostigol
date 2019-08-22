"use strict";

import angular from "angular";
import toastr from "angular-toastr";
import ngAnimate from "angular-animate";
import ngMaterial from "angular-material";
import ngMessages from "angular-messages";
import uiBreadcrumbs from "angular-utils-ui-breadcrumbs";

import configuration from "./app.config";
// App Modules
import directives from "./views/features/directives/directives.module";
import services from "./services/services.module";
import main from "./views/layouts/main/main.module";
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
console.log(uiBreadcrumbs);

// App modules
console.log(main);
console.log(footer);
console.log(configuration);

angular
    .module("pronostigol", [
        directives,
        services,
        sidenav,
        main,
        footer,
        home,
        toastr,
        ngAnimate,
        ngMaterial,
        ngMessages,
        uiBreadcrumbs
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
                $transitions.onSuccess({}, function() {
                    $rootScope.$broadcast("$stateChangeSuccess"); // For uiBreadcrumbs
                });

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
