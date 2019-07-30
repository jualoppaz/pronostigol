(function () {

    'use strict';

    angular.module('directives')
        .directive('loading', LoadingDirective);

    function LoadingDirective() {
        return {
            templateUrl: 'app/angular/views/features/directives/loading/loading.html'
        };
    }

})();