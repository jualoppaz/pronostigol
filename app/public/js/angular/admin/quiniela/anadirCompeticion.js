var app = angular.module('dashboard');

app.controller('AnadirCompeticionController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.competicion = {};

    $scope.guardar = function(){
        quiniela.createCompetition($scope.competicion)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                alert(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/quiniela/competiciones";
    };
}