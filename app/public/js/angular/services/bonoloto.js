(function(){

    'use strict';

    angular.module('bonoloto', [])
        .factory('bonoloto', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q){
        var service = {
            // Tickets
            getAllTickets: getAllTickets,
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
            getOccurrencesByResultWithReimbursement: getOccurrencesByResultWithReimbursement,
            getOccurrencesByReimbursement: getOccurrencesByReimbursement
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

        function getTicketById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/tickets/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function createTicket(ticket){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/api/bonoloto/tickets', ticket)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function editTicket(ticket){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put('/api/bonoloto/tickets', ticket)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function deleteTicketById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete('/api/bonoloto/tickets/' + id)
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

        function getYearById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/years/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function createYear(year){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/api/bonoloto/years', year)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function editYear(year){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put('/api/bonoloto/years', year)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function deleteYearById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete('/api/bonoloto/years/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByNumber(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/historical/aparicionesPorNumero')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByResult(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/historical/aparicionesPorResultado')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByResultWithReimbursement(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/historical/aparicionesPorResultadoConReintegro')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByReimbursement(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/bonoloto/historical/aparicionesPorReintegro')
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