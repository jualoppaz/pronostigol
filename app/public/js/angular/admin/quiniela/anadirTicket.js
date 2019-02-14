var app = angular.module("dashboard");

app.controller("TicketController", Controller);

Controller.$inject = ["$scope", "$http", "$window", "quiniela"];

function Controller($scope, $http, $window, quiniela) {
    quiniela
        .getAllCompetitions()
        .then(function(data) {
            $scope.competiciones = data;
        })
        .catch(function(err) {
            console.log(err);
        });

    quiniela
        .getAllTeams()
        .then(function(data) {
            $scope.equipos = data;
        })
        .catch(function(err) {
            console.log(err);
        });

    quiniela
        .getAllSeasons()
        .then(function(data) {
            $scope.temporadas = data;
        })
        .catch(function(err) {
            console.log(err);
        });

    $scope.quiniela = {};

    $scope.quiniela.partidos = [
        { fila: "1", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "2", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "3", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "4", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "5", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "6", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "7", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "8", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "9", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "10", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "11", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "12", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "13", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "14", pronosticos: [{ signo: "" }, { signo: "" }] },
        { fila: "15", pronosticos: [{ signo: "" }] }
    ];

    $scope.anadirPronostico = function() {
        if ($scope.quiniela.partidos[0].pronosticos == null) {
            for (i = 0; i < 15; i++) {
                $scope.quiniela.partidos[i].pronosticos = [];
                $scope.quiniela.partidos[i].pronosticos.push({ signo: "" });
            }
        }

        if ($scope.quiniela.partidos[0].pronosticos.length < 8) {
            for (var i = 0; i < $scope.quiniela.partidos.length; i++) {
                if (i !== $scope.quiniela.partidos.length - 1) {
                    $scope.quiniela.partidos[i].pronosticos.push({ signo: "" });
                }
            }
        }
    };

    $scope.eliminarPronostico = function() {
        for (var i = 0; i < $scope.quiniela.partidos.length; i++) {
            if (i !== $scope.quiniela.partidos.length - 1) {
                //No es el pleno
                $scope.quiniela.partidos[i].pronosticos.pop();
                if ($scope.quiniela.partidos[i].pronosticos.length === 1) {
                    $scope.quiniela.partidos[i].pronosticos.pop();
                    delete $scope.quiniela.partidos[i].pronosticos;
                }
            } else {
                // Es el pleno
                if ($scope.quiniela.partidos[0].pronosticos == null) {
                    delete $scope.quiniela.partidos[i].pronosticos;
                }
            }
        }
    };

    $scope.guardar = function() {
        quiniela
            .createTicket($scope.quiniela)
            .then(function(data) {
                $scope.redirigir();
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.redirigir = function() {
        $window.location.href = "/admin/quiniela";
    };

    $scope.calcularSigno = function(nuevoValor) {
        var res = "";

        if (nuevoValor != null) {
            if (
                nuevoValor == 1 ||
                nuevoValor == 2 ||
                nuevoValor == "X" ||
                nuevoValor == "x"
            ) {
                res = nuevoValor.toUpperCase();
            } else {
                res = nuevoValor.substring(0, nuevoValor.length - 1);
            }
        }
        return res;
    };

    $scope.calcularSignoPronosticos = function(pronosticos) {
        var res = pronosticos;

        if (pronosticos != null) {
            for (var i = 0; i < pronosticos.length; i++) {
                if (
                    pronosticos[i].signo != null &&
                    pronosticos[i].signo != ""
                ) {
                    if (
                        pronosticos[i].signo == 1 ||
                        pronosticos[i].signo == 2 ||
                        pronosticos[i].signo == "X" ||
                        pronosticos[i].signo == "x"
                    ) {
                        res[i].signo = pronosticos[i].signo.toUpperCase();
                    } else {
                        res[i].signo = pronosticos[i].signo.substring(
                            0,
                            pronosticos[i].signo.length - 1
                        );
                    }
                }
            }
        }
        return res;
    };

    $scope.$watch(
        "quiniela.jornada",
        function(jornada) {
            $scope.quiniela.jornada = "";

            var aux = "";

            for (var i = 0; i < jornada.length && i < 2; i++) {
                if ($scope.esNumero(jornada.charAt(i))) {
                    aux += jornada.charAt(i);
                }
            }

            $scope.quiniela.jornada = aux;
        },
        true
    );

    $scope.esNumero = function(caracter) {
        return !isNaN(caracter);
    };
}
