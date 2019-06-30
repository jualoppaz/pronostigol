var app = angular.module("qdb");

app.controller("TicketsController", Controller);

Controller.$inject = [
    "$scope",
    "$http",
    "$window",
    "$filter",
    "VariosService",
    "bonoloto"
];

function Controller($scope, $http, $window, $filter, VariosService, bonoloto) {
    $scope.tickets = [];

    $scope.numOfPages;
    $scope.totalItems;
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.ticketsPerPage = 5;

    bonoloto
        .getYears()
        .then(function(data) {
            $scope.years = data;
        })
        .catch(function(err) {
            console.log(err);
        });

    $scope.mostrarTickets = function(anyo) {
        $scope.selected = {
            year: anyo
        };

        if ($scope.tickets.length == 0 || $scope.tickets[0].anyo != anyo) {
            bonoloto
                .getTickets({
                    year: anyo,
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

    $scope.verTicket = function(ticket) {
        $window.location.href =
            "/bonoloto/sorteos/" + ticket.anyo + "/" + ticket.sorteo;
    };

    $scope.apuestaRealizada = function(ticket) {
        return VariosService.apuestaRealizada(ticket);
    };

    $scope.traducirDia = function(fecha) {
        return $filter("date")(fecha, "EEEE");
    };

    // Paginacion manual

    $scope.actualizarPagina = function(pagina) {
        $scope.currentPage = pagina;
    };

    $scope.consultarTickets = function() {
        $scope.tickets = [];

        bonoloto
            .getTickets({
                year: $scope.selected.year,
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

    $scope.reset = function() {
        $scope.tickets = [];
    };

    $scope.getPrize = function(ticket) {
        var res = $scope.apuestaRealizada(ticket)
            ? $filter("currency")(0)
            : "-";
        var prize = bonoloto.getPrize(ticket);

        if (prize > 0) {
            res = $filter("currency")(prize);
        }
        return res;
    };

    $scope.ticketHasPrize = function(ticket) {
        return $scope.apuestaRealizada(ticket) && bonoloto.getPrize(ticket) > 0;
    };
}
