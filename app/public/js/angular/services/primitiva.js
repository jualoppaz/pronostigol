(function () {

    'use strict';

    angular.module('primitiva', [])
        .factory('primitiva', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q) {

        var apiPrefix = "/api/primitiva";

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
            getOccurrencesByResultWithReimbursement: getOccurrencesByResultWithReimbursement,
            getOccurrencesByReimbursement: getOccurrencesByReimbursement
        };

        return service;

        function getTickets(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/tickets', {
                params: queryParameters
            })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getTicketById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/tickets/' + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createTicket(ticket) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post(apiPrefix + '/tickets', ticket)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editTicket(ticket) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(apiPrefix + '/tickets', ticket)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteTicketById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete(apiPrefix + '/tickets/' + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllYears() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/years')
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getYearById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/years/' + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createYear(year) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post(apiPrefix + '/years', year)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editYear(year) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(apiPrefix + '/years', year)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteYearById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete(apiPrefix + '/years/' + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByNumber(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByNumber', {
                params: queryParameters
            })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByResult(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByResult', {
                params: queryParameters
            })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByResultWithReimbursement() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/aparicionesPorResultadoConReintegro')
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesByReimbursement() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/aparicionesPorReintegro')
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

    }
})();