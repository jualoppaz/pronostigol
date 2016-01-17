var app = angular.module('dashboard');

app.controller('AnadirCompeticionController', function ($scope, $http, $window){

    $scope.competicion = {};

    $scope.guardar = function(){

        $http.post('/api/quiniela/competiciones', $scope.competicion)
            .success(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Competición añadida correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de competiciones registradas.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .error(function(data){
                alert(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/competiciones";

        $window.location.href = nuevaURL;
    };



});