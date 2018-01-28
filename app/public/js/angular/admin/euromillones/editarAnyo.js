var app = angular.module('dashboard');

app.controller('EditarAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'euromillones'];

function Controller($scope, $http, $window, euromillones){
    $scope.registro = {};

    var url = $window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    euromillones.getYearById(id)
        .then(function(data){
            $scope.registro = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.guardar = function(){
        euromillones.editYear($scope.registro)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/euromillones/anyos";
    };
}