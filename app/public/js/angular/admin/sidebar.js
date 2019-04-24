var app = angular.module("dashboard");

app.controller("SidebarController", Controller);

Controller.$inject = ["$scope", "$http", "$window"];

function Controller($scope, $http, $window) {
    $scope.loteria = "";

    var url = $window.location.href;

    if (url.indexOf("/quiniela") !== -1) {
        $scope.loteria = "quiniela";
    } else if (url.indexOf("/bonoloto") !== -1) {
        $scope.loteria = "bonoloto";
    } else if (url.indexOf("/primitiva") !== -1) {
        $scope.loteria = "primitiva";
    } else if (url.indexOf("/gordo") !== -1) {
        $scope.loteria = "gordo";
    } else if (url.indexOf("/euromillones") !== -1) {
        $scope.loteria = "euromillones";
    }

    $scope.correosNoLeidos = 0;

    $scope.pedidos = {};

    $scope.usuariosNuevos = 0;

    $http.get('/query/notReadedEmailsNumber')
        .success(function (data) {
            $scope.correosNoLeidos = data.emails;
        })
        .error(function (data) {
            console.log(data);
        });

    $http.get('/query/newUsers')
        .success(function (data) {
            $scope.usuariosNuevos = data.newUsers;
        })
        .error(function (data) {
            console.log(data);
        });

        .error(function(data) {
            console.log(data);
        });
}
