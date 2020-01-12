var app = angular.module("dashboard");

app.controller("TicketController", Controller);

Controller.$inject = ["$scope", "$http", "$window", "$filter", "primitiva"];

function Controller($scope, $http, $window, $filter, primitiva) {
    $scope.ticket = {};

    $scope.ticket.precio = "4";

    $scope.anyos = [];

    primitiva
        .getAllYears()
        .then(function(data) {
            $scope.anyos = $filter("orderBy")(data, "name");
        })
        .catch(function(err) {
            console.log(err);
        });

    $scope.ticket.resultado = {
        bolas: [
            {
                numero: null
            },
            {
                numero: null
            },
            {
                numero: null
            },
            {
                numero: null
            },
            {
                numero: null
            },
            {
                numero: null
            }
        ],
        reintegro: "",
        complementario: ""
    };

    $scope.ticket.apuestas = {
        reintegro: "",
        combinaciones: [
            [
                {
                    numero: 4
                },
                {
                    numero: 8
                },
                {
                    numero: 13
                },
                {
                    numero: 19
                },
                {
                    numero: 27
                },
                {
                    numero: 38
                }
            ],
            [
                {
                    numero: 1
                },
                {
                    numero: 6
                },
                {
                    numero: 10
                },
                {
                    numero: 22
                },
                {
                    numero: 37
                },
                {
                    numero: 46
                }
            ],
            [
                {
                    numero: 32
                },
                {
                    numero: 36
                },
                {
                    numero: 39
                },
                {
                    numero: 42
                },
                {
                    numero: 45
                },
                {
                    numero: 47
                }
            ],
            [
                {
                    numero: 40
                },
                {
                    numero: 41
                },
                {
                    numero: 43
                },
                {
                    numero: 44
                },
                {
                    numero: 48
                },
                {
                    numero: 49
                }
            ]
        ]
    };

    $scope.anadirApuesta = function() {
        if ($scope.ticket.apuestas.combinaciones == null) {
            $scope.ticket.apuestas.combinaciones = [
                [
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    }
                ]
            ];
        } else if ($scope.ticket.apuestas.combinaciones.length === 0) {
            $scope.ticket.apuestas.combinaciones = [
                [
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    },
                    {
                        numero: null
                    }
                ]
            ];
        }

        if ($scope.ticket.apuestas.combinaciones.length < 8) {
            $scope.ticket.apuestas.combinaciones[
                $scope.ticket.apuestas.combinaciones.length
            ] = [
                {
                    numero: null
                },
                {
                    numero: null
                },
                {
                    numero: null
                },
                {
                    numero: null
                },
                {
                    numero: null
                },
                {
                    numero: null
                }
            ];
        }
    };

    $scope.eliminarApuesta = function() {
        if ($scope.ticket.apuestas.combinaciones.length !== 0) {
            $scope.ticket.apuestas.combinaciones.pop();

            if ($scope.ticket.apuestas.combinaciones.length === 1) {
                $scope.ticket.apuestas.combinaciones = [];
            }
        }
    };

    $scope.guardar = function() {
        primitiva
            .createTicket($scope.ticket)
            .then(function() {
                $scope.redirigir();
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.redirigir = function() {
        $window.location.href = "/admin/primitiva";
    };
}
