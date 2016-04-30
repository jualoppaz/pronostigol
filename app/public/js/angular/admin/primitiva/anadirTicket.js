var app = angular.module('dashboard');

app.controller('TicketController', function ($scope, $http, $window, $filter){

    $scope.ticket = {};

    $scope.ticket.precio = "2";

    $scope.anyos = [];

    $http.get('/api/primitiva/years')
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
            },{
                numero: ""
            }
        ],
        reintegro: "",
        complementario: ""
    };

    /*
    $scope.ticket.apuestas = {
        reintegro: "",
        combinaciones: [
            [
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
                },{
                    numero: ""
                }
            ], [
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
                },{
                    numero: ""
                }
            ]
        ]
    };
    */

    /*
     $scope.ticket.apuestas = {
     reintegro: "",
     combinaciones: [
     [
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
     },{
     numero: ""
     }
     ], [
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
     },{
     numero: ""
     }
     ]
     ]
     };
     */

    $scope.ticket.apuestas = {
        reintegro: "",
        combinaciones: [
            [
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
                },{
                    numero: "38"
                }
            ], [
                {
                    numero: "1"
                },{
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
            ]
        ]
    };

    $scope.anadirApuesta = function(){
        if($scope.ticket.apuestas.combinaciones == null){

            $scope.ticket.apuestas.combinaciones = [
                [
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
                    },{
                        numero: ""
                    }
                ]
            ];
        }else if($scope.ticket.apuestas.combinaciones.length == 0){
            $scope.ticket.apuestas.combinaciones = [
                [
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
                    },{
                        numero: ""
                    }
                ]
            ];
        }

        if($scope.ticket.apuestas.combinaciones.length < 8){

            console.log("Anadimos la segunda");

            $scope.ticket.apuestas.combinaciones[$scope.ticket.apuestas.combinaciones.length] = [
                [
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
                    },{
                        numero: ""
                    }
                ]
            ];
        }
    };

    $scope.eliminarApuesta = function(){

        if($scope.ticket.apuestas.combinaciones.length != 0){

            $scope.ticket.apuestas.combinaciones.pop();

            if($scope.ticket.apuestas.combinaciones.length == 1){
                $scope.ticket.apuestas.combinaciones = [];
            }

        }
    };

    $scope.guardar = function(){

        $http.post('/api/primitiva/tickets/', $scope.ticket)
            .success(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Ticket de Primitiva añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de tickets de Primitiva registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.cancelar = function(){
        var nuevaURL = "/admin/primitiva";

        $window.location.href = nuevaURL;
    };

});