(function(){

    'use strict';

    angular.module('bonoloto', [])
        .factory('bonoloto', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q){
        var service = {
            getAllTickets: getAllTickets,
            getAllYears: getAllYears
        };

        return service;

        function getAllTickets(queryParameters){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/tickets', {
                params: queryParameters
            })
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getAllYears(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/years')
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