var app = angular.module('dashboard');

app.controller('AnadirEquipoController', function ($scope, $http, $window){

    $scope.equipo = {};

    $scope.guardar = function(){

        $http.post('/api/quiniela/equipos', $scope.equipo)
            .success(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Registro añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de equipos registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .error(function(data){
                alert(data);
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/equipos";

        $window.location.href = nuevaURL;
    };



});