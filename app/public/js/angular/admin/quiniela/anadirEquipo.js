var app = angular.module('dashboard');

app.controller('AnadirEquipoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.equipo = {};

    $scope.guardar = function(){
        quiniela.createTeam($scope.equipo)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                alert(err);
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/quiniela/equipos";
    };
}