var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'bonoloto'];

function Controller ($scope, $http, $window, $filter, bonoloto){

    $scope.ticket = {};

    $scope.ticket.precio = "1";

    $scope.anyos = [];

    bonoloto.getAllYears()
        .then(function(data){
            $scope.anyos = $filter('orderBy')(data, "name");
        })
        .catch(function(err){
            console.log(err);
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
        bonoloto.createTicket($scope.ticket)
            .then(function(){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Ticket de Bonoloto añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de tickets de Bonoloto registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/bonoloto";

        $window.location.href = nuevaURL;
    };

};