(function () {
    "use strict";

    angular.module("gordo", []).factory("gordo", service);

    service.$inject = ["$http", "$q"];

    function service($http, $q) {
        var apiPrefix = "/api/gordo";

        var service = {
            // Tickets
            getTickets: getTickets,
            getTicketById: getTicketById,
            createTicket: createTicket,
            editTicket: editTicket,
            deleteTicketById: deleteTicketById,
            ticketHasForecasts: ticketHasForecastsFn,
            getPrize: getPrizeFn,
            // Years
            getAllYears: getAllYears,
            getYearById: getYearById,
            createYear: createYear,
            editYear: editYear,
            deleteYearById: deleteYearById,
            // Historical
            getOccurrencesByNumber: getOccurrencesByNumber,
            getOccurrencesByResult: getOccurrencesByResult,
            getOccurrencesByResultWithSpecialNumber: getOccurrencesByResultWithSpecialNumber,
            getOccurrencesBySpecialNumber: getOccurrencesBySpecialNumber,
            getLastDateByNumber: getLastDateByNumber,
        };

        return service;

        function getTickets(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/tickets", {
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

            $http
                .get(apiPrefix + "/tickets/" + id)
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

            $http
                .post(apiPrefix + "/tickets", ticket)
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

            $http
                .put(apiPrefix + "/tickets", ticket)
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

            $http
                .delete(apiPrefix + "/tickets/" + id)
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

            $http
                .get(apiPrefix + "/years")
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

            $http
                .get(apiPrefix + "/years/" + id)
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

            $http
                .post(apiPrefix + "/years", year)
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

            $http
                .put(apiPrefix + "/years", year)
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

            $http
                .delete(apiPrefix + "/years/" + id)
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

            $http
                .get(apiPrefix + "/historical/occurrencesByNumber", {
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

            $http
                .get(apiPrefix + "/historical/occurrencesByResult", {
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

        function getOccurrencesByResultWithSpecialNumber(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(
                    apiPrefix +
                    "/historical/occurrencesByResultWithSpecialNumber",
                    {
                        params: queryParameters
                    }
                )
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getOccurrencesBySpecialNumber(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/OccurrencesBySpecialNumber", {
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

        function getLastDateByNumber(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/lastDateByNumber", {
                    params: queryParameters
                })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err.data);
                });

            return promise;
        }

        /**
         * Método que sirve para saber si en un ticket se ha realizado alguna apuesta
         *
         * @param {*} ticket
         */
        function ticketHasForecastsFn(ticket) {
            var res = false;

            if (ticket && ticket.apuestas && ticket.apuestas.combinaciones) {
                res = ticket.apuestas.combinaciones.length > 0;
            }
            return res;
        }

        /**
         * Método que sirve para saber la cuantía del premio de un ticket.
         *
         * @param {*} ticket
         *
         * @author jualoppaz
         */
        function getPrizeFn(ticket) {
            var res = 0;

            if (ticket && ticket.premio != null) {
                res = ticket.premio;
            }
            return res;
        }
    }
})();
