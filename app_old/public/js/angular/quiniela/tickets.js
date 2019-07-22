var app = angular.module("qdb");

app.controller("QuinielasController", Controller);

Controller.$inject = ["$scope", "$http", "$window", "quiniela", "$filter"];

function Controller($scope, $http, $window, quiniela, $filter) {
    $scope.tickets = [];

    $scope.currentPage = 1;
    $scope.ticketsPerPage = 5;
    $scope.maxSize = 5;

    quiniela
        .getAllSeasons()
        .then(function(data) {
            var seasons = [];

            for (var i = 0; i < data.length; i++) {
                var season = data[i];

                if (season.value !== "Histórico") {
                    seasons.push(season);
                }
            }

            $scope.seasons = seasons;
        })
        .catch(function(err) {
            console.log(err);
        });

    $scope.mostrarTickets = function(temporada) {
        $scope.selected = {
            season: temporada
        };

        if (
            $scope.tickets.length == 0 ||
            $scope.tickets[0].temporada != temporada
        ) {
            quiniela
                .getAllTickets({
                    season: temporada,
                    per_page: $scope.ticketsPerPage,
                    page: $scope.currentPage
                })
                .then(function(data) {
                    var tickets = data.data;
                    var total = data.total;
                    var perPage = data.perPage;
                    var numOfPages = total / perPage;

                    $scope.tickets = tickets;
                    $scope.totalItems = total;

                    var floor = Math.floor(total / perPage);

                    if (numOfPages > floor) {
                        numOfPages = Math.floor(total / perPage) + 1;
                    }

                    $scope.numOfPages = numOfPages;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    };

    $scope.consultarTickets = function() {
        $scope.tickets = [];

        quiniela
            .getAllTickets({
                season: $scope.selected.season,
                per_page: $scope.ticketsPerPage,
                page: $scope.currentPage
            })
            .then(function(data) {
                var tickets = data.data;
                var total = data.total;
                var perPage = data.perPage;
                var numOfPages = total / perPage;

                $scope.tickets = tickets;
                $scope.totalItems = total;

                var floor = Math.floor(total / perPage);

                if (numOfPages > floor) {
                    numOfPages = Math.floor(total / perPage) + 1;
                }

                $scope.numOfPages = numOfPages;
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.verTicket = function(ticket) {
        $window.location.href =
            "/quiniela/sorteos/" + ticket.temporada + "/" + ticket.jornada;
    };

    // Paginacion manual

    $scope.actualizarPagina = function(pagina) {
        $scope.currentPage = pagina;
    };

    $scope.propiedad = "fecha";

    $scope.apuestaRealizada = function(ticket) {
        return quiniela.ticketHasForecasts(ticket);
    };

    $scope.getPrize = function(ticket) {
        var res = $scope.apuestaRealizada(ticket)
            ? $filter("currency")(0)
            : "-";
        var prize = quiniela.getPrize(ticket);

        if (prize > 0) {
            res = $filter("currency")(prize);
        }
        return res;
    };

    $scope.ticketHasPrize = function(ticket) {
        return $scope.apuestaRealizada(ticket) && quiniela.getPrize(ticket) > 0;
    };
}
