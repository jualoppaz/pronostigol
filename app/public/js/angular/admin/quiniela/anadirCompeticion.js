var app = angular.module('dashboard');

app.controller('AnadirCompeticionController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.competicion = {};

    $scope.guardar = function(){
        quiniela.createCompetition($scope.competicion)
            .then(function(){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Competición añadida correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de competiciones registradas.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                alert(err);
            });
    };

    $scope.redirigir = function(){
        var nuevaURL = "/admin/quiniela/competiciones";

        $window.location.href = nuevaURL;
    };
};