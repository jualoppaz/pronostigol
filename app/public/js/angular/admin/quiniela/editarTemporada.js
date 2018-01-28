var app = angular.module('dashboard');

app.controller('EditarTemporadaController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.registro = {};

    var url = $window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    quiniela.getSeasonById(id)
        .then(function(data){
            $scope.registro = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.guardar = function(){
        quiniela.editSeason($scope.registro)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/quiniela/temporadas";
    };
}