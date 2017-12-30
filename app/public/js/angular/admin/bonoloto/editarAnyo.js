var app = angular.module('dashboard');

app.controller('EditarAnyoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'bonoloto'];
    
function Controller ($scope, $http, $window, bonoloto){

    $scope.registro = {};

    var url = window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[6];
    
    bonoloto.getYearById(id)
        .then(function(data){
            $scope.registro = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.guardar = function(){
        bonoloto.editYear($scope.registro)
            .then(function(){
                angular.element("#modalTitleRegistroEditadoCorrectamente").text("Año editado correctamente");
                angular.element("#modalTextRegistroEditadoCorrectamente").text("A continuación se le redirigirá al listado de años registrados.");
                angular.element("#modal-registroEditadoCorrectamente").modal('show');
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.redirigir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/bonoloto/anyos";

        $window.location.href = nuevaURL;
    };
};