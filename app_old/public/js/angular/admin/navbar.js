var app = angular.module('dashboard');

app.controller('NavbarController', Controller);

Controller.$inject = ['$scope', '$http', '$window'];

function Controller($scope, $http, $window){

    $scope.seccion = "";

    var url = $window.location.href;

    if(url.indexOf("/quiniela") !== -1){
        $scope.seccion = "Quiniela";
        $scope.loteria = "quiniela";
    }else if(url.indexOf("/bonoloto") !== -1){
        $scope.seccion = "Bonoloto";
        $scope.loteria = "bonoloto";
    }else if(url.indexOf("/primitiva") !== -1){
        $scope.seccion = "Primitiva";
        $scope.loteria = "primitiva";
    }else if(url.indexOf("/gordo") !== -1){
        $scope.seccion = "El Gordo";
        $scope.loteria = "gordo";
    }else if(url.indexOf("/euromillones") !== -1){
        $scope.seccion = "Euromillones";
        $scope.loteria = "euromillones";
    }

    $scope.cerrarSesion = function(){
        $http.get('/api/logout')
            .success(function(){
                $scope.usuarioEstaLogueado = false;
                $scope.redirigir();
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigir = function(){
        $window.location.href = "/";
    };
}