(function() {
    "use strict";

    angular.module("quiniela", []).factory("quiniela", service);

    service.$inject = ["$http", "$q"];

    function service($http, $q) {
        var apiPrefix = "/api/quiniela";

        var service = {
            // Tickets
            getAllTickets: getAllTickets,
            getTicketBySeasonAndDay: getTicketBySeasonAndDay,
            createTicket: createTicket,
            editTicket: editTicket,
            // Seasons
            getAllSeasons: getAllSeasons,
            getSeasonById: getSeasonById,
            createSeason: createSeason,
            editSeason: editSeason,
            deleteSeasonById: deleteSeasonById,
            // Competitions
            getAllCompetitions: getAllCompetitions,
            getCompetitionById: getCompetitionById,
            createCompetition: createCompetition,
            editCompetition: editCompetition,
            deleteCompetitionById: deleteCompetitionById,
            // Teams
            getAllTeams: getAllTeams,
            getTeamById: getTeamById,
            createTeam: createTeam,
            editTeam: editTeam,
            deleteTeamById: deleteTeamById,
            // Historical
            getHistorical: getHistorical,
            getHistoricalCombinations: getHistoricalCombinations
        };

        return service;

        function getAllTickets(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/tickets", {
                    params: queryParameters
                })
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err.data);
                });

            return promise;
        }

        function getTicketBySeasonAndDay(season, day) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/tickets/season/" + season + "/day/" + day)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createTicket(ticket) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/tickets", ticket)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editTicket(ticket) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/tickets", ticket)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllSeasons() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/seasons")
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getSeasonById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/seasons/" + id)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createSeason(season) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/seasons", season)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editSeason(season) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/seasons", season)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteSeasonById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete(apiPrefix + "/seasons/" + id)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllCompetitions() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/competitions")
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getCompetitionById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/competitions/" + id)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createCompetition(competition) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/competitions", competition)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editCompetition(competition) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/competitions", competition)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteCompetitionById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete(apiPrefix + "/competitions/" + id)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllTeams() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/teams")
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getTeamById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/teams/" + id)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createTeam(team) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/teams", team)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editTeam(team) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/teams", team)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteTeamById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete(apiPrefix + "/teams/" + id)
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getHistorical(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical", {
                    params: queryParameters
                })
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalCombinations(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/combinations", {
                    params: queryParameters
                })
                .then(function(data) {
                    defered.resolve(data.data);
                })
                .catch(function(err) {
                    defered.reject(err);
                });

            return promise;
        }
    }
})();
