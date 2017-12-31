var app = angular.module('dashboard');

app.controller('EditarTemporadaController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.registro = {};


    var url = window.location.href;

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
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Temporada editada correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de temporadas registradas.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela/temporadas";

        $window.location.href = nuevaURL;
    };
};