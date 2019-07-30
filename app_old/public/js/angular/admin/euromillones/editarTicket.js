var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'euromillones'];

function Controller($scope, $http, $window, $filter, euromillones){

    $scope.ticket = {};

    $scope.consultando = true;

    var url = $window.location.href;

    var id = url.split("/tickets/")[1];

    euromillones.getTicketById(id)
        .then(function(data){
            $scope.ticket = data;

            $scope.ticket.fecha = $filter('date')(data.fecha, 'dd/MM/yyyy');

            $scope.consultando = false;
        })
        .catch(function(err){
            console.log(err);
        });

    euromillones.getAllYears()
        .then(function(data){
            $scope.anyos = data;
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
        }

        if ($scope.ticket.apuestas.combinaciones.length < 8) {
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
        };
    };

    $scope.eliminarApuesta = function(){
        if($scope.ticket.apuestas.combinaciones.length !== 0){
            $scope.ticket.apuestas.combinaciones.pop();
            if($scope.ticket.apuestas.combinaciones.length === 1){
                $scope.ticket.apuestas.combinaciones = [];
            }
        }
    };

    $scope.guardar = function(){
        euromillones.editTicket($scope.ticket)
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