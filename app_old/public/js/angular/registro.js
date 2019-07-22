var app = angular.module('qdb');

app.controller('SignupController', Controller);

Controller.$inject = ['$scope', '$http', '$timeout', '$window'];

function Controller($scope, $http, $timeout, $window) {
    $scope.loguedUser = {};

    $scope.form = {};
    $scope.errores = {};
    $scope.errores.usuarioVacio = "Debe introducir un usuario";
    $scope.errores.usuarioInvalido = "Debe introducir un usuario válido. Los espacios no están permitidos.";
    $scope.errores.passVacio = "Debe introducir una contraseña.";
    $scope.usuarioOcupado = "El usuario introducido está en uso. Introduzca otro.";
    $scope.registroOk = "Ha sido registrado con éxito.";

    $scope.usuarioVacio = false;
    $scope.passVacio = false;
    $scope.usuarioInvalido = false;
    $scope.passInvalido = false;
    $scope.registroConExito = false;
    $scope.usuarioEnUso = false;

    $scope.hayErrores = false;

    $scope.reiniciarMensajes = function(){
        $scope.hayErrores       = false;
        $scope.usuarioVacio     = false;
        $scope.usuarioInvalido  = false;
        $scope.passVacio        = false;
        $scope.registroConExito = false;
        $scope.usuarioEnUso     = false;
    };

    $scope.registrarse = function(){
        $scope.reiniciarMensajes();
        var usuario = String($scope.form.user);
        var pass = String($scope.form.pass);

        if(usuario == 'undefined' || usuario.length == 0){
            $scope.errores.usuario = "Debe introducir un usuario.";
            $scope.usuarioVacio = true;
            $scope.hayErrores = true;
        }else{
            for(var i=0; i<usuario.length;i++){
                if(usuario.charAt(i) === " "){
                    $scope.usuarioInvalido = true;
                    $scope.hayErrores = true;
                }
            }

        }
        if(pass == 'undefined' || pass.length == 0){
            $scope.passVacio = true;
            $scope.hayErrores = true;
        }

        if(!$scope.hayErrores){

            console.log("/api/signup");

            $http.post('/api/signup', $scope.form)
                .success(function(data){
                    if(data === "ok"){
                        $scope.registroConExito = true;
                        $timeout(function(){
                            $window.location = "/login";
                        },2000);
                    }
                })
                .error(function(data){
                    if(data === "username-taken"){
                        $scope.usuarioEnUso = true;
                    }else{
                        if(data.usuarioVacio){
                            $scope.usuarioVacio = true;
                        }
                        if(data.usuarioInvalido){
                            $scope.usuarioInvalido = true;
                        }
                        if(data.passVacio){
                            $scope.passVacio = true;
                        }
                    }
                });
        }
    };
}