var app = angular.module('dashboard');

app.controller('AnadirAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'bonoloto'];

function Controller ($scope, $http, $window, bonoloto){

    $scope.registro = {};

    $scope.guardar = function(){
        bonoloto.createYear($scope.registro)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                if(err === "year-already-exists"){
                    alert("El año introducido ya existe.");
                }
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/bonoloto/anyos";
    };
}