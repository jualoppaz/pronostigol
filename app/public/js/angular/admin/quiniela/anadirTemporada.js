var app = angular.module('dashboard');

app.controller('AnadirTemporadaController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.registro = {};

    $scope.guardar = function(){
        quiniela.createSeason($scope.registro)
            .then(function(data){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Temporada añadida correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de temporadas registradas.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                alert(err);
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/temporadas";

        $window.location.href = nuevaURL;
    };
};