var app = angular.module('qdb');

app.controller('QuinielaController', Controller);

Controller.$inject = ['$scope', '$http', '$window'];

function Controller($scope, $http, $window) {

    $scope.mensajeInformativoEliminacion = "Si acepta, el comentario será eliminado de forma definitiva.";

    $scope.currentPage = 1;
    $scope.commentsPerPage = 3;

    /*fin paginacion*/


    $scope.fecha = "empty";
    $scope.visitorInfo = "empty";

    $scope.comentarioPalabrasLargas = false;

    $scope.comments = null;

    $scope.tweets = [];

    $scope.usuarioEsAnonimo = null;

    $scope.comentario = {};

    $scope.comentarioEnviadoCorrectamente = false;

    $scope.comentarioEliminadoCorrectamente = false;
}