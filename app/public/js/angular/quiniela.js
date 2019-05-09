var app = angular.module("qdb");

app.controller("QuinielaController", Controller);

Controller.$inject = ["$scope", "$http", "$window"];

function Controller($scope, $http, $window) {
    $scope.currentPage = 1;

    /*fin paginacion*/

    $scope.fecha = "empty";
    $scope.tweets = [];

    $scope.usuarioEsAnonimo = null;
}
