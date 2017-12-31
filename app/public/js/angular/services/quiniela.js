(function(){

    'use strict';

    angular.module('quiniela', [])
        .factory('quiniela', service);

    service.$inject = ['$http', '$q'];

    function service($http, $q){
        var service = {
            // Tickets
            getAllTickets: getAllTickets,
            getAllTicketsBySeason: getAllTicketsBySeason,
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
            getHistoricalByLocalTeam: getHistoricalByLocalTeam,
            getHistoricalByVisitorTeam: getHistoricalByVisitorTeam,
            getHistoricalByLocalAndVisitorTeam: getHistoricalByLocalAndVisitorTeam,
            getHistoricalByCompetition: getHistoricalByCompetition,
            getHistoricalByCompetitionAndLocalTeam: getHistoricalByCompetitionAndLocalTeam,
            getHistoricalByCompetitionAndVisitorTeam: getHistoricalByCompetitionAndVisitorTeam,
            getHistoricalByCompetitionAndLocalAndVisitorTeam: getHistoricalByCompetitionAndLocalAndVisitorTeam,
            getHistoricalBySeason: getHistoricalBySeason,
            getHistoricalBySeasonAndLocalTeam: getHistoricalBySeasonAndLocalTeam,
            getHistoricalBySeasonAndVisitorTeam: getHistoricalBySeasonAndVisitorTeam,
            getHistoricalBySeasonAndLocalAndVisitorTeam: getHistoricalBySeasonAndLocalAndVisitorTeam,
            getHistoricalBySeasonAndCompetition: getHistoricalBySeasonAndCompetition,
            getHistoricalBySeasonCompetitionAndLocalTeam: getHistoricalBySeasonCompetitionAndLocalTeam,
            getHistoricalBySeasonCompetitionAndVisitorTeam: getHistoricalBySeasonCompetitionAndVisitorTeam,
            getHistoricalBySeasonCompetitionAndLocalAndVisitorTeam: getHistoricalBySeasonCompetitionAndLocalAndVisitorTeam,
            getHistoricalCombinations: getHistoricalCombinations
        };

        return service;

        function getAllTickets(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/tickets')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getAllTicketsBySeason(season){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/tickets/season/' + season)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getTicketBySeasonAndDay(season, day){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/tickets/season/' + season + '/day/' + day)
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

            $http.post('/api/quiniela/tickets', ticket)
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

            $http.put('/api/quiniela/tickets', ticket)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

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

        function getSeasonById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/temporadas/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function createSeason(season){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/api/quiniela/temporadas', season)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function editSeason(season){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put('/api/quiniela/temporadas', season)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function deleteSeasonById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete('/api/quiniela/temporadas/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getAllCompetitions(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/competiciones')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getCompetitionById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/competiciones/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function createCompetition(competition){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/api/quiniela/competiciones', competition)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function editCompetition(competition){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put('/api/quiniela/competiciones', competition)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function deleteCompetitionById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete('/api/quiniela/competiciones/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getAllTeams(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/equipos')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getTeamById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/equipos/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function createTeam(team){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/api/quiniela/equipos', team)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function editTeam(team){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put('/api/quiniela/equipos', team)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function deleteTeamById(id){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete('/api/quiniela/equipos/' + id)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistorical(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical')
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByLocalTeam(team){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/localTeam/' + team)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByVisitorTeam(team){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/visitorTeam/' + team)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByLocalAndVisitorTeam(localTeam, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get("/api/quiniela/historical/footballMatch/localTeam/" + localTeam + "/visitorTeam/" + visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByCompetition(competition){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/competition/' + competition)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByCompetitionAndLocalTeam(competition, localTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/competition/' + competition + "/localTeam/" + localTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByCompetitionAndVisitorTeam(competition, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/competition/' + competition + "/visitorTeam/" + visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalByCompetitionAndLocalAndVisitorTeam(competition, localTeam, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/competition/' + competition + "/footballMatch/localTeam/" + localTeam
                + "/visitorTeam/" + visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeason(season){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonAndLocalTeam(season, localTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season + "/localTeam/" + localTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonAndVisitorTeam(season, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season + "/visitorTeam/" + visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonAndLocalAndVisitorTeam(season, localTeam, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season + "/footballMatch/localTeam/" + localTeam +
                "/visitorTeam/" + visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonAndCompetition(season, competition){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season + "/competition/" + competition)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonCompetitionAndLocalTeam(season, competition, localTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season + "/competition/" + competition + "/localTeam/" +
                localTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonCompetitionAndVisitorTeam(season, competition, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/season/' + season + "/competition/" + competition + "/visitorTeam/" +
                visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalBySeasonCompetitionAndLocalAndVisitorTeam(season, competition, localTeam, visitorTeam){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get("/api/quiniela/historical/season/" + season + "/competition/" + competition + "/footballMatch/" +
                "localTeam/" + localTeam + "/visitorTeam/" + visitorTeam)
                .then(function(data){
                    defered.resolve(data.data);
                })
                .catch(function(err){
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalCombinations(){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/api/quiniela/historical/combinaciones')
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