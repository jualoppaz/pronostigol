var app = angular.module('dashboard');

app.controller('EditarCompeticionController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.registro = {};

    var url = $window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    quiniela.getCompetitionById(id)
        .then(function(data){
            console.log(data);
            $scope.registro = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.guardar = function(){
        quiniela.editCompetition($scope.registro)
            .then(function(){
                $scope.redirigir();
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/admin/quiniela/competiciones";
    };
}