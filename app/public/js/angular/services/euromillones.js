(function() {

    'use strict';

    angular.module('euromillones', [])
        .factory('euromillones', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q) {

        var apiPrefix = "/api/euromillones";

        var service = {
            // Tickets
            getTickets: getTickets,
            getTicketById: getTicketById,
            createTicket: createTicket,
            editTicket: editTicket,
            deleteTicketById: deleteTicketById,
            // Years
            getAllYears: getAllYears,
            getYearById: getYearById,
            createYear: createYear,
            editYear: editYear,
            deleteYearById: deleteYearById,
            // Historical
            getOccurrencesByNumber: getOccurrencesByNumber,
            getOccurrencesByResult: getOccurrencesByResult,
            getOccurrencesByResultWithStars: getOccurrencesByResultWithStars,
            getOccurrencesByStar: getOccurrencesByStar,
            getOccurrencesByStarsPair: getOccurrencesByStarsPair
        };

        return service;

        function getTickets(queryParameters){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/tickets', {
                params: queryParameters
            })
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getTicketById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/tickets/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function createTicket(ticket){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post(apiPrefix + '/tickets', ticket)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function editTicket(ticket){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(apiPrefix + '/tickets', ticket)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function deleteTicketById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete('/api/primitiva/tickets/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getAllYears(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/years')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getYearById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/years/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function createYear(year){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post(apiPrefix + '/years', year)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function editYear(year){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(apiPrefix + '/years', year)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function deleteYearById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete(apiPrefix + '/years/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByNumber(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByNumber')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByResult(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByResult')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByResultWithStars(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByResultWithStars')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByStar(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByStar')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByStarsPair(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByStarsPair')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }
    }
})();