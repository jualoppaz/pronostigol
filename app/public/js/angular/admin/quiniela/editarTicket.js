var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'quiniela'];

function Controller ($scope, $http, $window, $filter, quiniela){

    $scope.quiniela = {};

    $scope.consultando = true;

    var url = $window.location.href;

    var season = url.split("/tickets/")[1].split("/")[0];
    var jornada = url.split("/tickets/")[1].split("/")[1];

    quiniela.getTicketBySeasonAndDay(season, jornada)
        .then(function(data){
            data.fecha = $filter('date')(data.fecha, 'dd/MM/yyyy');

            $scope.quiniela = data;

            $scope.consultando = false;
        })
        .catch(function(err){
            console.log(err);
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

    $scope.anadirPronostico = function(){
        if($scope.quiniela.partidos[0].pronosticos == null){
            for(i=0; i<15; i++){
                $scope.quiniela.partidos[i].pronosticos = [];
                $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
            }
        }

        if($scope.quiniela.partidos[0].pronosticos.length < 8){
            for(var i=0; i<$scope.quiniela.partidos.length; i++){
                if(i != $scope.quiniela.partidos.length - 1){
                    /*
                    if($scope.quiniela.partidos[i].pronosticos == null){
                        $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
                    }
                    */
                    $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
                }
            }
        }
    };

    $scope.eliminarPronostico = function(){
        for(var i=0; i<$scope.quiniela.partidos.length; i++){
            if(i != $scope.quiniela.partidos.length - 1){ //No es el pleno
                $scope.quiniela.partidos[i].pronosticos.pop();
                if($scope.quiniela.partidos[i].pronosticos.length == 1){
                    $scope.quiniela.partidos[i].pronosticos.pop();
                    delete $scope.quiniela.partidos[i].pronosticos;
                }
            }else{// Es el pleno
                if($scope.quiniela.partidos[0].pronosticos == null){
                    delete $scope.quiniela.partidos[i].pronosticos;
                }
            }
        }
    };

    $scope.guardar = function(){
        quiniela.editTicket($scope.quiniela)
            .then(function(){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Ticket de Quiniela editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de tickets de Quiniela registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela";

        $window.location.href = nuevaURL;
    };
};