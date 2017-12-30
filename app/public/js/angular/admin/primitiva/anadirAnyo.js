var app = angular.module('dashboard');

app.controller('AnadirAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'primitiva'];

function Controller ($scope, $http, $window, primitiva){

    $scope.registro = {};

    $scope.guardar = function(){
        primitiva.createYear($scope.registro)
            .then(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Año añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de años registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);

                if(err == "year-already-exists"){
                    alert("El año introducido ya existe.");
                }
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/primitiva/anyos";

        $window.location.href = nuevaURL;
    };
};