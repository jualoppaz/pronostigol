var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'euromillones'];

function Controller($scope, $http, $window, $filter, euromillones){

    $scope.ticket = {};

    $scope.ticket.precio = "5";

    $scope.anyos = [];

    euromillones.getAllYears()
        .then(function(data){
            $scope.anyos = $filter('orderBy')(data, "name");
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.ticket.resultado = {
        bolas: [
            {
                numero: null
            },{
                numero: null
            },{
                numero: null
            },{
                numero: null
            },{
                numero: null
            }
        ],
        estrellas: [
            {
                numero: null
            },{
                numero: null
            }
        ]
    };

    $scope.ticket.apuestas = {
        combinaciones: [
            {
                numeros: [
                    {
                        numero: 4
                    },{
                        numero: 8
                    },{
                        numero: 13
                    },{
                        numero: 19
                    },{
                        numero: 27
                    }
                ],
                estrellas: [
                    {
                        numero: 6
                    },{
                        numero: 11
                    }
                ]
            },{
                numeros: [
                    {
                        numero: 6
                    },{
                        numero: 10
                    },{
                        numero: 22
                    },{
                        numero: 37
                    },{
                        numero: 46
                    }
                ],
                estrellas: [
                    {
                        numero: 7
                    },{
                        numero: 9
                    }
                ]
            }
        ]
    };

    $scope.anadirApuesta = function(){
        if($scope.ticket.apuestas.combinaciones == null){

            $scope.ticket.apuestas.combinaciones = [
                {
                    numeros: [
                        {
                            numero: null
                        }, {
                            numero: null
                        }, {
                            numero: null
                        }, {
                            numero: null
                        }, {
                            numero: null
                        }
                    ],
                    estrellas: [
                        {
                            numero: null
                        }, {
                            numero: null
                        }
                    ]
                }
            ];
        }else if($scope.ticket.apuestas.combinaciones.length === 0){
            $scope.ticket.apuestas.combinaciones = [
                {
                    numeros: [
                        {
                            numero: null
                        }, {
                            numero: null
                        }, {
                            numero: null
                        }, {
                            numero: null
                        }, {
                            numero: null
                        }
                    ],
                    estrellas: [
                        {
                            numero: null
                        }, {
                            numero: null
                        }
                    ]
                }
            ];
        } else if ($scope.ticket.apuestas.combinaciones.length < 8) {

            $scope.ticket.apuestas.combinaciones[$scope.ticket.apuestas.combinaciones.length] = {
                numeros: [
                    {
                        numero: null
                    }, {
                        numero: null
                    }, {
                        numero: null
                    }, {
                        numero: null
                    }, {
                        numero: null
                    }
                ],
                estrellas: [
                    {
                        numero: null
                    }, {
                        numero: null
                    }
                ]
            };
        }
    };

    $scope.eliminarApuesta = function(){
        if($scope.ticket.apuestas.combinaciones.length !== 0){
            $scope.ticket.apuestas.combinaciones.pop();
        }
    };

    $scope.guardar = function(){
        euromillones.createTicket($scope.ticket)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/euromillones";
    };
}