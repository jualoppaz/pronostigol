var app = angular.module('dashboard');

app.controller('AnadirEquipoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.equipo = {};

    $scope.guardar = function(){
        quiniela.createTeam($scope.equipo)
            .then(function(){
                angular.element("#modalTitleRegistroAnadidoCorrectamente").text("Registro añadido correctamente");
                angular.element("#modalTextRegistroAnadidoCorrectamente").text("A continuación se le redirigirá al listado de equipos registrados.");
                angular.element("#modal-registroAnadidoCorrectamente").modal('show');
            })
            .catch(function(err){
                alert(err);
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/equipos";

        $window.location.href = nuevaURL;
    };
};