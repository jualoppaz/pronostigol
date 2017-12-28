(function(){

    'use strict';

    angular.module('quiniela', [])
        .factory('quiniela', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q){
        var service = {
            getAllSeasons: getAllSeasons
        };

        return service;

        function getAllSeasons(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/temporadas')
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