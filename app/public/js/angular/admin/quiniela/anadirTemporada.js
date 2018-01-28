var app = angular.module('dashboard');

app.controller('AnadirTemporadaController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.registro = {};

    $scope.guardar = function(){
        quiniela.createSeason($scope.registro)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                alert(err);
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/quiniela/temporadas";
    };
}