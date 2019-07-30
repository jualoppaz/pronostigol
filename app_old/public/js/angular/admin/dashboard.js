var app = angular.module('dashboard', ['ui.bootstrap', 'bonoloto', 'primitiva', 'quiniela', 'euromillones', 'gordo']);

app.controller('DashBoardController', Controller);

Controller.$inject = ['$scope', '$http', '$window'];

function Controller($scope, $http, $window){

}