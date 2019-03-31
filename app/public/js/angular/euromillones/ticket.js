var app = angular.module("qdb");

app.controller("TicketController", Controller);

Controller.$inject = [
    "$scope",
    "$http",
    "VariosService",
    "$window",
    "euromillones"
];

function Controller($scope, $http, VariosService, $window, euromillones) {
    $scope.ticket = {};

    $scope.aciertos = [];

    $scope.consultaRealizada = false;

    $scope.mostrarFlechaAnterior = true;

    $scope.mostrarFlechaSiguiente = true;

    var url = $window.location.href;

    var fragmentos = url.split("/");

    euromillones
        .getTickets({
            year: fragmentos[5],
            raffle: fragmentos[6]
        })
        .then(function(data) {
            $http
                .get("/query/euromillones/newestDay")
                .success(function(data2) {
                    var sorteo2 = data2.sorteo;
                    var anyo2 = data2.anyo;

                    if (
                        data.data[0].sorteo === sorteo2 &&
                        data.data[0].anyo === anyo2
                    ) {
                        $scope.mostrarFlechaSiguiente = false;
                    }

                    $http
                        .get("/query/euromillones/oldestDay")
                        .success(function(data3) {
                            var sorteo3 = data3.sorteo;
                            var anyo3 = data3.anyo;

                            if (
                                data.data[0].sorteo === sorteo3 &&
                                data.data[0].anyo === anyo3
                            ) {
                                $scope.mostrarFlechaAnterior = false;
                            }

                            $scope.ticket = data.data[0];
                            $scope.consultaRealizada = true;
                        });
                })
                .error(function(data) {
                    console.log(data);
                });
        })
        .catch(function() {
            $scope.consultaRealizada = true;
        });

    $scope.determinarNumeroAciertos = function(combinacion) {
        return euromillones.getSuccessfulNumbersAmount(
            $scope.ticket.resultado,
            combinacion
        );
    };

    $scope.determinarCategoriaPremio = function(combinacion) {
        return euromillones.getPrizeCategory(
            $scope.ticket.resultado,
            combinacion
        );
    };

    $scope.bolaHaSidoAcertada = function(bola) {
        return euromillones.isSuccessfulNumber($scope.ticket.resultado, bola);
    };

    $scope.ticketEstaVacio = function() {
        return VariosService.jsonVacio($scope.ticket);
    };

    $scope.ticketSiguiente = function() {
        var sorteo = Number($scope.ticket.sorteo) + 1;
        var tickets;

        euromillones
            .getTickets({
                year: $scope.ticket.anyo,
                raffle: sorteo
            })
            .then(function(data) {
                tickets = data.data;
                if (tickets.length > 0 && tickets[0].sorteo) {
                    $window.location.href =
                        "/euromillones/sorteos/" +
                        tickets[0].anyo +
                        "/" +
                        tickets[0].sorteo;
                } else {
                    var anyo = Number($scope.ticket.anyo) + 1;
                    euromillones
                        .getTickets({
                            year: anyo,
                            raffle: 1
                        })
                        .then(function(data) {
                            tickets = data.data;
                            if (tickets.length > 0 && tickets[0].sorteo) {
                                $window.location.href =
                                    "/euromillones/sorteos/" +
                                    tickets[0].anyo +
                                    "/" +
                                    tickets[0].sorteo;
                            } else {
                                console.log(
                                    "No hay tickets más recientes o hay un salto entre el ticket actual y el próximo."
                                );
                            }
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.ticketAnterior = function() {
        var nuevoSorteo = Number($scope.getDayFromURL()) - 1;
        var tickets;

        if (nuevoSorteo >= 1) {
            euromillones
                .getTickets({
                    year: $scope.getAnyoFromURL(),
                    raffle: nuevoSorteo
                })
                .then(function(data) {
                    tickets = data.data;
                    if (tickets.length > 0 && tickets[0].sorteo) {
                        $window.location.href =
                            "/euromillones/sorteos/" +
                            tickets[0].anyo +
                            "/" +
                            nuevoSorteo;
                    } else {
                        $http
                            .get(
                                "/query/euromillones/higherDayByYear/" +
                                    $scope.getAnyoFromURL()
                            )
                            .success(function(data) {
                                tickets = data.data;
                                if (tickets[0].sorteo) {
                                    $window.location.href =
                                        "/euromillones/sorteos/" +
                                        tickets[0].anyo +
                                        "/" +
                                        tickets[0].sorteo;
                                } else {
                                    console.log(
                                        "No hay tickets anteriores o hay un salto en las fechas."
                                    );
                                }
                            })
                            .error(function(err) {
                                console.log(err);
                            });
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            var anyo = Number($scope.getAnyoFromURL()) - 1;

            $http
                .get("/query/euromillones/higherDayByYear/" + anyo)
                .success(function(data) {
                    tickets = data.data;
                    if (tickets[0].sorteo) {
                        $window.location.href =
                            "/euromillones/sorteos/" +
                            tickets[0].anyo +
                            "/" +
                            tickets[0].sorteo;
                    } else {
                        console.log(
                            "No hay tickets anteriores o hay un salto en las fechas."
                        );
                        $scope.mostrarFlechaAnterior = false;
                    }
                })
                .error(function(data) {
                    console.log(data);
                });
        }
    };

    $scope.getAnyoFromURL = function() {
        var url = $window.location.href;

        return url.split("/")[5];
    };

    $scope.getDayFromURL = function() {
        var url = $window.location.href;

        return url.split("/")[6];
    };
}
