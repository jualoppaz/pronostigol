var app = angular.module('qdb');

app.controller('IndexController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter'];

function Controller($scope, $http, $window, $filter) {
    $scope.currentPage = 1;

    $scope.fecha = "empty";
    $scope.visitorInfo = "empty";

    $scope.tweets = [];

    $scope.usuarioEsAnonimo = null;

    $scope.nuevaRespuesta = {};

    $http.get('/lastModified')
        .success(function(data){
            $scope.fecha = data.fecha;
        })
        .error(function(data){
            if(data === "not-avaible"){
                $scope.fecha = "No disponible";
            }else if(data === "local-environment"){
                $scope.fecha = "Estamos en local";
            }
        });

    $http.get('/getVisitorInfo')
        .success(function(data){
            $scope.visitorInfo = data;
        })
        .error(function(data){
            $scope.error = data;
            console.log(data);
        });

    $scope.aceptarCookies = function(){
        window.sessionStorage.setItem('pronostigol_cookies_accepted', true);
    };

    $scope.mostrarAvisoCookies = function(){
        return !window.sessionStorage.getItem('pronostigol_cookies_accepted');
    };

    $http.get('/api/user')
        .success(function(data){
            $scope.usuarioEstaLogueado = true;
            $scope.usuarioEsAnonimo = false;
        })
        .error(function(data){
            if(data === "not-logued-in"){
                $scope.usuarioEstaLogueado = false;
                $scope.usuarioEsAnonimo = true;
            }else{
                console.log(data);
                $scope.usuarioEsAnonimo = true;
            }
        });

    $http.get('/api/twitter/pronostigolTweets')
        .success(function(data){
            var aux = [];

            for(var i=0; aux.length<4; i++){ // Nos quedamos con los 4 tweets mas recientes
                if(data[i].text.indexOf("RT @") === -1){
                    aux[aux.length] = data[i];
                }
            }

            for(var j=0; j<aux.length; j++){ // Cambiamos el formato de las fechas
                aux[j].created_at = new Date(aux[j].created_at);
            }

            $scope.tweets = aux;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.getCSScolor = function(index) {
        return "primary";
    };
}
