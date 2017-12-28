(function(){

    'use strict';

    angular.module('primitiva', [])
        .factory('primitiva', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q){
        var service = {
            getAllYears: getAllYears
        };

        return service;

        function getAllYears(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/primitiva/years')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }
    }


})();