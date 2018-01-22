var app = angular.module('dashboard');

app.controller('AnadirAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'gordo'];

function Controller ($scope, $http, $window, gordo){

    $scope.registro = {};

    $scope.guardar = function(){
        gordo.createYear($scope.registro)
            .then(function(){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Año añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de años registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);

                if(err === "year-already-exists"){
                    alert("El año introducido ya existe.");
                }
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/gordo/anyos";

        $window.location.href = nuevaURL;
    };
}