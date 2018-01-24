(function(){

    'use strict';

    angular.module('bonoloto', [])
        .factory('bonoloto', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q){

        var apiPrefix = "/api/bonoloto";

        var service = {
            // Utils
            getPrizeCategory: getPrizeCategory,
            getSuccessfulNumbersAmount: getSuccessfulNumbersAmount,
            isSuccessfulNumber: isSuccessfulNumber,
            isSuccessfulNumberAsComplementary: isSuccessfulNumberAsComplementary,
            // Tickets
            getTickets: getTickets,
            getTicketById: getTicketById,
            createTicket: createTicket,
            editTicket: editTicket,
            deleteTicketById: deleteTicketById,
            // Years
            getYears: getYears,
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

        /**
         * Metodo para determinar la categoria del premio asociada a una apuesta dados el resultado, apuesta y reintegro apostado
         */
        function getPrizeCategory(resultado, combinacion, reintegroApostado){
            var res = "";
            var numeroAciertos = 0;
            var reintegroAcertado = false;
            var complementarioAcertado = false;

            if (reintegroApostado === resultado.reintegro) { // 0<=R<=9. Por tanto, podemos tener cualquier categoría.
                reintegroAcertado = true;

                for (i = 0; i < combinacion.length; i++) {
                    for (j = 0; j < resultado.bolas.length; j++) {
                        if (combinacion[i].numero === resultado.bolas[j].numero) {
                            numeroAciertos += 1;
                        }
                    }
                }

                if (numeroAciertos === 5) {
                    for (i = 0; i < combinacion.length; i++) {
                        for (j = 0; j < resultado.bolas.length; j++) {
                            if (combinacion[i].numero === resultado.complementario) {
                                complementarioAcertado = true;
                                break;
                            }
                        }
                    }
                }

            } else { // Se puede acertar 6, 5, 4 o 3
                for (i = 0; i < combinacion.length; i++) {
                    for (j = 0; j < resultado.bolas.length; j++) {
                        if (combinacion[i].numero === resultado.bolas[j].numero) {
                            numeroAciertos += 1;
                        }
                    }
                }

                if (numeroAciertos === 5) {
                    for (var i = 0; i < combinacion.length; i++) {
                        for (var j = 0; j < resultado.bolas.length; j++) {
                            if (combinacion[i].numero === resultado.complementario) {
                                complementarioAcertado = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (numeroAciertos === 6) {
                res = "6"
            } else if (numeroAciertos === 5) {
                if (complementarioAcertado) {
                    res = "5 + C";
                } else {
                    res = "5";
                }
            } else if (numeroAciertos === 4) {
                res = "4";
            } else if (numeroAciertos === 3) {
                res = "3";
            } else if (reintegroAcertado) {
                res = "R";
            } else {
                res = "-";
            }

            return res;
        }

        /**
         * Metodo para determinar el número de aciertos en una apuesta
         */
        function getSuccessfulNumbersAmount(resultado, combinacion, reintegroApostado){
            var res = "";

            var numeroAciertos = 0;

            var reintegroAcertado = false;

            var complementarioAcertado = false;

            if (reintegroApostado === resultado.reintegro) { // 0<=R<=9. Por tanto, podemos tener cualquier categoría.
                reintegroAcertado = true;
            }

            // Se puede acertar 6, 5, 4 o 3
            for (var i = 0; i < combinacion.length; i++) {
                for (var j = 0; j < resultado.bolas.length; j++) {
                    if (combinacion[i].numero === resultado.bolas[j].numero) {
                        numeroAciertos += 1;
                    }

                    if (combinacion[i].numero === resultado.complementario) {
                        complementarioAcertado = true;
                    }
                }
            }

            if (numeroAciertos !== 5) {
                complementarioAcertado = false;
            }

            if (numeroAciertos === 6) {
                res = "6";
            } else if (numeroAciertos === 5) {
                if (complementarioAcertado) {
                    res = "5 + C";
                } else {
                    res = "5";
                }
            } else if (numeroAciertos === 4) {
                res = "4";
            } else if (numeroAciertos === 3) {
                res = "3";
            } else if (numeroAciertos === 2) {
                res = "2";
            } else if (numeroAciertos === 1) {
                res = "1";
            } else if (reintegroAcertado) {
                res = "R";
            } else {
                res = "0";
            }

            return res;
        }

        /**
         * Metodo para determinar si un número incluido en una apuesta ha aparecido en la apuesta ganadora
         */
        function isSuccessfulNumber(resultado, bola){
            var res = false;

            for (var i = 0; i < resultado.bolas.length; i++) {
                if (String(bola.numero) === String(resultado.bolas[i].numero)) {
                    res = true;
                    break;
                }
            }

            return res;
        }

        /**
         * Metodo para determinar si un número incluido en una apuesta coincide con el complementario de la apuesta ganadora
         */
        function isSuccessfulNumberAsComplementary(resultado, bola){
            var res = false;

            if (String(bola.numero) === String(resultado.complementario)) {
                res = true;
            }

            return res;
        }

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

            $http.delete(apiPrefix + '/tickets/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getYears(){
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

        function getOccurrencesByResultWithReimbursement(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByResultWithReimbursement')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err.data);
                });

            return promise;
        }

        function getOccurrencesByReimbursement(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get(apiPrefix + '/historical/occurrencesByReimbursement')
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