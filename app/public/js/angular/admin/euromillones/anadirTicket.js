var app = angular.module('dashboard');

app.controller('TicketController', function ($scope, $http, $window, $filter){

    $scope.ticket = {};

    $scope.ticket.precio = "5";

    $scope.anyos = [];

    $http.get('/api/euromillones/years')
        .success(function(data){
            $scope.anyos = $filter('orderBy')(data, "name");
        })
        .error(function(data){
            console.log(data);
        });

    $scope.ticket.resultado = {
        bolas: [
            {
                numero: ""
            },{
                numero: ""
            },{
                numero: ""
            },{
                numero: ""
            },{
                numero: ""
            }
        ],
        estrellas: [
            {
                numero: ""
            },{
                numero: ""
            }
        ]
    };

    $scope.ticket.apuestas = {


        combinaciones: [
            {
                numeros: [
                    {
                        numero: "4"
                    },{
                        numero: "8"
                    },{
                        numero: "13"
                    },{
                        numero: "19"
                    },{
                        numero: "27"
                    }
                ],
                estrellas: [
                    {
                        numero: "6"
                    },{
                        numero: "11"
                    }
                ]
            },{
                numeros: [
                    {
                        numero: "6"
                    },{
                        numero: "10"
                    },{
                        numero: "22"
                    },{
                        numero: "37"
                    },{
                        numero: "46"
                    }
                ],
                estrellas: [
                    {
                        numero: "7"
                    },{
                        numero: "9"
                    }
                ]
            }
        ]
    };

    $scope.anadirApuesta = function(){

        // Esta insercion se realizara unicamente
        if($scope.ticket.apuestas.combinaciones == null){

            $scope.ticket.apuestas.combinaciones = [
                [
                    {
                        numeros: [
                            {
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            }
                        ],
                        estrellas: [
                            {
                                numero: ""
                            },{
                                numero: ""
                            }
                        ]
                    }
                ]
            ];
        }else if($scope.ticket.apuestas.combinaciones.length == 0){
            $scope.ticket.apuestas.combinaciones = [
                [
                    {
                        numeros: [
                            {
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            }
                        ],
                        estrellas: [
                            {
                                numero: ""
                            },{
                                numero: ""
                            }
                        ]
                    }
                ]
            ];
        }else if($scope.ticket.apuestas.combinaciones.length < 8){

            $scope.ticket.apuestas.combinaciones[$scope.ticket.apuestas.combinaciones.length] = [
                [
                    {
                        numeros: [
                            {
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            },{
                                numero: ""
                            }
                        ],
                        estrellas: [
                            {
                                numero: ""
                            },{
                                numero: ""
                            }
                        ]
                    }
                ]
            ];
        }
    };

    $scope.eliminarApuesta = function(){

        if($scope.ticket.apuestas.combinaciones.length != 0){

            $scope.ticket.apuestas.combinaciones.pop();

            /*
            if($scope.ticket.apuestas.combinaciones.length == 1){
                $scope.ticket.apuestas.combinaciones = [];
            }*/

        }
    };

    $scope.guardar = function(){

        $http.post('/api/euromillones/tickets/', $scope.ticket)
            .success(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Ticket de Euromillones añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de tickets de Euromillones registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/euromillones";

        $window.location.href = nuevaURL;
    };

});