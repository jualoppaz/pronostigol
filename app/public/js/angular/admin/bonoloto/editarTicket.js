var app = angular.module('dashboard');

app.controller('TicketController', function ($scope, $http, $window, $filter){

    $scope.ticket = {};

    $scope.consultando = true;

    var url = $window.location.href;

    var id = url.split("/tickets/")[1];

    $http.get('/api/bonoloto/tickets/' + id)
        .success(function(data){
            $scope.ticket = data;

            $scope.ticket.fecha = $filter('date')(data.fecha, 'dd/MM/yyyy');

            $scope.consultando = false;
        })
        .error(function(data){
            console.log(data);
        });


    $scope.anyos = [];

    $http.get('/api/bonoloto/years')
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

        $http.put('/api/bonoloto/tickets', $scope.ticket)
            .success(function(data){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Ticket de Bonoloto editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de tickets de Bonoloto registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/bonoloto";

        $window.location.href = nuevaURL;
    };

});