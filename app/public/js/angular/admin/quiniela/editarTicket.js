var app = angular.module('dashboard');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'quiniela'];

function Controller ($scope, $http, $window, $filter, quiniela){

    quiniela.getAllCompetitions()
        .then(function(data){
            $scope.competiciones = data;
        })
        .catch(function(err){
            console.log(err);
        });

    quiniela.getAllTeams()
        .then(function(data){
            $scope.equipos = data;
        })
        .catch(function(err){
            console.log(err);
        });

    quiniela.getAllSeasons()
        .then(function(data){
            $scope.temporadas = data;
        })
        .catch(function(err){
            console.log(err);
        });

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

            $scope.specialMatchExclusion =
                $scope.quiniela.partidos.length === 15 ? false : true;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.anadirPronostico = function(){
        if($scope.quiniela.partidos[0].pronosticos == null){
            for(i=0; i<15; i++){
                $scope.quiniela.partidos[i].pronosticos = [];
                $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
            }
        }

        if($scope.quiniela.partidos[0].pronosticos.length < 8){
            for(var i=0; i<$scope.quiniela.partidos.length; i++){
                if(i !== $scope.quiniela.partidos.length - 1){
                    $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
                }
            }
        }
    };

    $scope.eliminarPronostico = function(){
        for(var i=0; i<$scope.quiniela.partidos.length; i++){
            if(i !== $scope.quiniela.partidos.length - 1){ //No es el pleno
                $scope.quiniela.partidos[i].pronosticos.pop();
                if($scope.quiniela.partidos[i].pronosticos.length === 1){
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
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/quiniela";
    };
}
    $scope.toggleSpecialMatch = function() {
        var matchesNumber = $scope.quiniela.partidos.length;

        if (matchesNumber === 15) {
            $scope.quiniela.partidos.splice(matchesNumber - 1, 1);
        } else {
            $scope.quiniela.partidos.push({
                fila: "15",
                pronosticos: [{ signo: "" }]
            });
        }
    };
