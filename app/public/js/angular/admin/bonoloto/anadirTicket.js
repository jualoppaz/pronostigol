var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'bonoloto'];

function Controller ($scope, $http, $window, $filter, bonoloto){

    $scope.ticket = {};

    $scope.ticket.precio = "1";

    $scope.anyos = [];

    bonoloto.getYears()
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
            },{
                numero: null
            }
        ],
        reintegro: null,
        complementario: null
    };

    $scope.ticket.apuestas = {
        reintegro: null,
        combinaciones: [
            [
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
                },{
                    numero: 38
                }
            ], [
                {
                    numero: 1
                },{
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
            ]
        ]
    };

    $scope.anadirApuesta = function(){
        if($scope.ticket.apuestas.combinaciones == null){

            $scope.ticket.apuestas.combinaciones = [
                [
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
                    },{
                        numero: null
                    }
                ]
            ];
        }else if($scope.ticket.apuestas.combinaciones.length === 0){
            $scope.ticket.apuestas.combinaciones = [
                [
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
                    },{
                        numero: null
                    }
                ]
            ];
        }

        if($scope.ticket.apuestas.combinaciones.length < 8){
            $scope.ticket.apuestas.combinaciones[$scope.ticket.apuestas.combinaciones.length] = [
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
                }, {
                    numero: null
                }
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
        bonoloto.createTicket($scope.ticket)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/bonoloto";
    };
}