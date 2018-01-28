// Controlador Base. Por eso es el único que tiene dependencias

var app = angular.module('qdb', ['services', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'bonoloto', 'euromillones',
    'quiniela', 'primitiva', 'gordo']);

app.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});

app.controller('LoguedUserController', Controller);

Controller.$inject = ['$scope', 'UserService', '$http', '$window'];

function Controller($scope, UserService, $http, $window){
    $scope.usuarioEstaLogueado = false;

    $scope.usuarioLogueado = {};

    getUser();

    function getUser(){
        UserService.solicitarUsuario()
            .success(function(data){
                $scope.usuarioEstaLogueado = true;
                $scope.usuarioLogueado = data;
            })
            .error(function(data){
                if(data === "not-loguedin-user"){
                    $scope.usuarioEstaLogueado = false;
                }
            });
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
        $window.location.reload();
    };
}