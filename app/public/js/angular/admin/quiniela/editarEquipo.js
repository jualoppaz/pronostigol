var app = angular.module('dashboard');

app.controller('EditarEquipoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.equipo = {};

    var url = window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];

    quiniela.getTeamById(id)
        .then(function(data){
            $scope.equipo = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.guardar = function(){
        quiniela.editTeam($scope.equipo)
            .then(function(){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Equipo editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de equipos registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/equipos";

        $window.location.href = nuevaURL;
    };
};