var app = angular.module('dashboard');

app.controller('EditarCompeticionController', Controller);

Controller.$inject = ['$scope', '$http', 'window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.registro = {};

    var url = window.location.href;

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
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Competición editada correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de competiciones registradas.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        var nuevaURL = "/admin/quiniela/competiciones";
        $window.location.href = nuevaURL;
    };
};