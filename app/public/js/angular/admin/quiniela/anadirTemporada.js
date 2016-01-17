var app = angular.module('dashboard');

app.controller('AnadirTemporadaController', function ($scope, $http, $window){

    $scope.registro = {};

    $scope.guardar = function(){

        $http.post('/api/quiniela/temporadas', $scope.registro)
            .success(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Temporada añadida correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de temporadas registradas.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .error(function(data){
                alert(data);
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/temporadas";

        $window.location.href = nuevaURL;
    };



});