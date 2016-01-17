var app = angular.module('dashboard');

app.controller('TicketController', function ($scope, $http, $window, $filter){

    $scope.ticket = {};

    $scope.consultando = true;

    var url = $window.location.href;

    var id = url.split("/tickets/")[1];

    $http.get('/api/gordo/tickets/' + id)
        .success(function(data){
            $scope.ticket = data;

            $scope.ticket.fecha = $filter('date')(data.fecha, 'dd/MM/yyyy');

            $scope.consultando = false;
        })
        .error(function(data){
            console.log(data);
        });


    $scope.anyos = [
        {
            name: "2014",
            value: "2014"
        },{
            name: "2015",
            value: "2015"
        }
    ];

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
        numeroClave: ""
    };

    $scope.ticket.apuestas = {
        numeroClave: "",
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

        $http.put('/api/gordo/tickets', $scope.ticket)
            .success(function(data){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Ticket de El Gordo editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de tickets de El Gordo de la Primitiva registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/gordo";

        $window.location.href = nuevaURL;
    };

});