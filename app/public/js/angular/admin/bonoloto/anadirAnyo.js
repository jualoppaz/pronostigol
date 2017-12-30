var app = angular.module('dashboard');

app.controller('AnadirAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'bonoloto'];

function Controller ($scope, $http, $window, bonoloto){

    $scope.registro = {};

    $scope.guardar = function(){
        bonoloto.createYear($scope.registro)
            .then(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Año añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de años registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                if(data == "year-already-exists"){
                    alert("El año introducido ya existe.");
                }
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/bonoloto/anyos";

        $window.location.href = nuevaURL;
    };
};