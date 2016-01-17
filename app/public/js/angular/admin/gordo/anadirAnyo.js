var app = angular.module('dashboard');

app.controller('AnadirAnyoController', function ($scope, $http, $window){

    $scope.registro = {};

    $scope.guardar = function(){

        $http.post('/api/gordo/years', $scope.registro)
            .success(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Año añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de años registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);

                if(data == "year-already-exists"){
                    alert("El año introducido ya existe.");
                }
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/gordo/anyos";

        $window.location.href = nuevaURL;
    };



});