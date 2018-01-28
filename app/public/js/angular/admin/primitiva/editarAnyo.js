var app = angular.module('dashboard');

app.controller('EditarAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'primitiva'];

function Controller ($scope, $http, $window, primitiva){

    $scope.registro = {};

    var url = $window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    primitiva.getYearById(id)
        .then(function(data){
            $scope.registro = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.guardar = function(){
        primitiva.editYear($scope.registro)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/primitiva/anyos";
    };
}