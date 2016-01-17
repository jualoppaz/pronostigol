var app = angular.module('dashboard');

app.controller('EditarEquipoController', function ($scope, $http, $window){

    $scope.equipo = {};


    var url = window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    $http.get('/api/quiniela/equipos/' + id)
        .success(function(data){
            $scope.equipo = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.guardar = function(){

        $http.put('/api/quiniela/equipos', $scope.equipo)
            .success(function(data){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Equipo editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de equipos registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/equipos";

        $window.location.href = nuevaURL;
    };



});