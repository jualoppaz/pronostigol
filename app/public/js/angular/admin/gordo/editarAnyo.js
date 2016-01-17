var app = angular.module('dashboard');

app.controller('EditarAnyoController', function ($scope, $http, $window){

    $scope.registro = {};


    var url = window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    $http.get('/api/gordo/years/' + id)
        .success(function(data){
            $scope.registro = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.guardar = function(){

        $http.put('/api/gordo/years', $scope.registro)
            .success(function(data){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Año editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de años registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/gordo/anyos";

        $window.location.href = nuevaURL;
    };



});