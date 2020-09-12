(function () {
    "use strict";

    angular.module("euromillones", []).factory("euromillones", service);

    service.$inject = ["$http", "$q"];

    function service($http, $q) {
        var apiPrefix = "/api/euromillones";

        var service = {
            // Utils
            getPrizeCategory: getPrizeCategory,
            getSuccessfulNumbersAmount: getSuccessfulNumbersAmount,
            isSuccessfulNumber: isSuccessfulNumber,
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
            getOccurrencesByResultWithStars: getOccurrencesByResultWithStars,
            getOccurrencesByStar: getOccurrencesByStar,
            getOccurrencesByStarsPair: getOccurrencesByStarsPair,
            getLastDateByNumber: getLastDateByNumber,
        };

        return service;

        function getPrizeCategory(resultado, combinacion) {
            var res = "";

            var resultado = resultado;

            var numeroAciertos = 0;

            var numeroEstrellasAcertadas = 0;

            // Determinamos cuantas bolas se han acertado de las 5

            for (var i = 0; i < combinacion.numeros.length; i++) {
                for (var j = 0; j < resultado.bolas.length; j++) {
                    if (
                        combinacion.numeros[i].numero ===
                        resultado.bolas[j].numero
                    ) {
                        numeroAciertos += 1;
                    }
                }
            }

            for (i = 0; i < combinacion.estrellas.length; i++) {
                for (j = 0; j < resultado.estrellas.length; j++) {
                    if (
                        combinacion.estrellas[i].numero ===
                        resultado.estrellas[j].numero
                    ) {
                        numeroEstrellasAcertadas += 1;
                    }
                }
            }

            if (numeroAciertos === 5) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "1ª Categoría";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "2ª Categoría";
                } else {
                    res = "3ª Categoría";
                }
            } else if (numeroAciertos === 4) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "4ª Categoría";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "5ª Categoría";
                } else {
                    res = "6ª Categoría";
                }
            } else if (numeroAciertos === 3) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "7ª Categoría";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "9ª Categoría";
                } else {
                    res = "10ª Categoría";
                }
            } else if (numeroAciertos === 2) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "8ª Categoría";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "12ª Categoría";
                } else {
                    res = "13ª Categoría";
                }
            } else if (numeroAciertos === 1) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "11ª Categoría";
                } else {
                    res = "-";
                }
            } else {
                res = "-";
            }

            return res;
        }

        function getSuccessfulNumbersAmount(resultado, combinacion) {
            var res = "";

            var resultado = resultado;

            var numeroAciertos = 0;

            var numeroEstrellasAcertadas = 0;

            // Determinamos cuantas bolas se han acertado de las 5

            for (var i = 0; i < combinacion.numeros.length; i++) {
                for (var j = 0; j < resultado.bolas.length; j++) {
                    if (
                        combinacion.numeros[i].numero ===
                        resultado.bolas[j].numero
                    ) {
                        numeroAciertos += 1;
                    }
                }
            }

            for (i = 0; i < combinacion.estrellas.length; i++) {
                for (j = 0; j < resultado.estrellas.length; j++) {
                    if (
                        combinacion.estrellas[i].numero ===
                        resultado.estrellas[j].numero
                    ) {
                        numeroEstrellasAcertadas += 1;
                    }
                }
            }

            if (numeroAciertos === 5) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "5 + 2 E";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "5 + 1 E";
                } else {
                    res = "5";
                }
            } else if (numeroAciertos === 4) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "4 + 2 E";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "4 + 1 E";
                } else {
                    res = "4";
                }
            } else if (numeroAciertos === 3) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "3 + 2 E";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "3 + 1 E";
                } else {
                    res = "3";
                }
            } else if (numeroAciertos === 2) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "2 + 2 E";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "2 + 1 E";
                } else {
                    res = "2";
                }
            } else if (numeroAciertos === 1) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "1 + 2 E";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "1 + 1 E";
                } else {
                    res = "1";
                }
            } else if (numeroAciertos === 0) {
                if (numeroEstrellasAcertadas === 2) {
                    res = "0 + 2 E";
                } else if (numeroEstrellasAcertadas === 1) {
                    res = "0 + 1 E";
                } else {
                    res = "0";
                }
            }

            return res;
        }

        function isSuccessfulNumber(resultado, bola) {
            var resultado = resultado;
            var res = false;

            for (var i = 0; i < resultado.bolas.length; i++) {
                if (bola.numero === resultado.bolas[i].numero) {
                    res = true;
                    break;
                }
            }

            return res;
        }

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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
                });

            return promise;
        }

        function deleteTicketById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete("/api/primitiva/tickets/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
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
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByResultWithStars(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/occurrencesByResultWithStars", {
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

        function getOccurrencesByStar(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/occurrencesByStar", {
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

        function getOccurrencesByStarsPair(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/occurrencesByStarsPair", {
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
