"use strict";

import angular from "angular";
import toastr from "angular-toastr";
import ngAnimate from "angular-animate";
import ngTouch from "angular-touch";

import configuration from "./app.config";

// App Modules
import header from "./views/layouts/header/header.module";
import footer from "./views/layouts/footer/footer.module";
import home from "./views/home.module";

// Vendor modules
console.log(toastr);
console.log(ngAnimate);
console.log(ngTouch);

// App modules
console.log(header);
console.log(footer);
console.log(configuration);

angular
    .module("pronostigol", [header, footer, home, toastr, ngAnimate, ngTouch])
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
