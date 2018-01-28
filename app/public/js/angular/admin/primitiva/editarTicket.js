var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'primitiva'];

function Controller ($scope, $http, $window, $filter, primitiva){

    $scope.ticket = {};

    $scope.consultando = true;

    var url = $window.location.href;

    var id = url.split("/tickets/")[1];

    primitiva.getTicketById(id)
        .then(function(data){
            $scope.ticket = data;

            $scope.ticket.fecha = $filter('date')(data.fecha, 'dd/MM/yyyy');

            $scope.consultando = false;
        })
        .catch(function(err){
            console.log(err);
        });

    primitiva.getAllYears()
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
        }else if($scope.ticket.apuestas.combinaciones.length === 0){
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
        if($scope.ticket.apuestas.combinaciones.length !== 0){

            $scope.ticket.apuestas.combinaciones.pop();

            if($scope.ticket.apuestas.combinaciones.length === 1){
                $scope.ticket.apuestas.combinaciones = [];
            }

        }
    };

    $scope.guardar = function(){
        primitiva.editTicket($scope.ticket)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/primitiva";
    };
}