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
                .get("/api/quiniela/tickets/season/" + season + "/day/" + day)
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
                .post("/api/quiniela/tickets", ticket)
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
                .put("/api/quiniela/tickets", ticket)
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
                .get("/api/quiniela/temporadas")
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
                .get("/api/quiniela/temporadas/" + id)
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
                .post("/api/quiniela/temporadas", season)
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
                .put("/api/quiniela/temporadas", season)
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
                .delete("/api/quiniela/temporadas/" + id)
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
                .get("/api/quiniela/competiciones")
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
                .get("/api/quiniela/competiciones/" + id)
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
                .post("/api/quiniela/competiciones", competition)
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
                .put("/api/quiniela/competiciones", competition)
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
                .delete("/api/quiniela/competiciones/" + id)
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
                .get("/api/quiniela/equipos")
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
                .get("/api/quiniela/equipos/" + id)
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
                .post("/api/quiniela/equipos", team)
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
                .put("/api/quiniela/equipos", team)
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
                .delete("/api/quiniela/equipos/" + id)
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
                .get("/api/quiniela/historical", {
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
                .get("/api/quiniela/historical/combinations", {
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
