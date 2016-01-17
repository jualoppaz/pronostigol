var app = angular.module('dashboard');

app.controller('EditarTemporadaController', function ($scope, $http, $window){

    $scope.registro = {};


    var url = window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    $http.get('/api/quiniela/temporadas/' + id)
        .success(function(data){
            $scope.registro = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.guardar = function(){

        $http.put('/api/quiniela/temporadas', $scope.registro)
            .success(function(data){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Temporada editada correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de temporadas registradas.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/temporadas";

        $window.location.href = nuevaURL;
    };



});