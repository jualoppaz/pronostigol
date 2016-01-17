var app = angular.module('dashboard');

app.controller('SidebarController', function ($scope, $http, $window){

    $scope.loteria = "";

    var url = $window.location.href;

    if(url.indexOf("/quiniela") != -1){
        $scope.loteria = "quiniela";
    }else if(url.indexOf("/bonoloto") != -1){
        $scope.loteria = "bonoloto";
    }else if(url.indexOf("/primitiva") != -1){
        $scope.loteria = "primitiva";
    }else if(url.indexOf("/gordo") != -1){
        $scope.loteria = "gordo";
    }else if(url.indexOf("/euromillones") != -1){
        $scope.loteria = "euromillones";
    }

    $scope.correosNoLeidos = 0;

    $scope.pedidos = {};

    $scope.usuariosNuevos = 0;

    $scope.comentariosNuevosOEditados = 0;

    $http.get('/query/notReadedEmailsNumber')
        .success(function(data){
            $scope.correosNoLeidos = data.emails;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/query/notReadedOrders')
        .success(function(data){
            $scope.pedidos = data.orders;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/query/newUsers')
        .success(function(data){
            $scope.usuariosNuevos = data.newUsers;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/query/notVerifiedComments')
        .success(function(data){
            $scope.comentariosNuevosOEditados = data.length;
        })
        .error(function(data){
            console.log(data);
        });

});