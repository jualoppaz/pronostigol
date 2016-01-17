var app = angular.module('qdb');

app.controller('LoginController', function ($scope, $http, $window) {
    $scope.loguedUser = {};
    $scope.usuarioEstaLogueado = false;

    $scope.form = {};
    $scope.errores = {};
    $scope.hayErrores = false;
    $scope.errores.usuarioInexistente = "El usuario introducido no existe.";
    $scope.errores.usuarioVacio = "Debe introducir un usuario.";
    $scope.errores.passErroneo = "La contraseña introducida es errónea. Pruebe de nuevo.";
    $scope.errores.passVacio = "Debe introducir una contraseña.";
    $scope.errores.usuarioNoActivo = "Su cuenta aún no ha sido activada. Contacte con el administrador.";

    $scope.passErroneo = false;
    $scope.usuarioInexistente = false;
    $scope.usuarioVacio = false;
    $scope.usuarioNoActivo = false;

    $scope.reiniciarMensajes = function(){
        $scope.passErroneo = false;
        $scope.usuarioInexistente = false;
        $scope.usuarioVacio = false;
        $scope.passVacio = false;
        $scope.hayErrores = false;
        $scope.usuarioNoActivo = false;
    };

    $scope.loguearse = function(){
        $scope.reiniciarMensajes();
        var usuario = String($scope.form.user);
        var pass = String($scope.form.pass);
        if(angular.element("#recordar").checked){
            $scope.form.recordar = true;
        }
        if(usuario == 'undefined' || usuario.length == 0){
            $scope.usuarioVacio = true;
            $scope.hayErrores = true;
        }/*else{
            for(i=0; i<usuario.length;i++){
                if(usuario.charAt(i) == " "){
                    alert("Usuario invalido");
                    $scope.usuarioInvalido = true;
                    $scope.hayErrores = true;
                }
            }

        }*/
        if(pass == 'undefined' || pass.length == 0){
            $scope.passVacio = true;
            $scope.hayErrores = true;

        }

        if(!$scope.hayErrores){

            $http.post('/api/login', $scope.form)
                .success(function(data){

                    //angular.element("#modalTitleLogin").text("Login correcto");
                    //angular.element("#modalTextLogin").text("Pulse el botón para continuar");
                    //angular.element("#modal-login").modal('show');

                    $scope.redirigirTrasLogin();
                })
                .error(function(data){
                    if(data == "invalid-password"){
                        $scope.passErroneo = true;
                    }else if(data == "user-not-found"){
                        $scope.usuarioInexistente = true;
                    }else if(data == 'user-not-active'){
                        $scope.usuarioNoActivo = true;
                    }
                });
        }
    };

    $scope.redirigirTrasLogin = function(){
        $http.get('/api/lastURL')
            .success(function(data){
                $window.location.href = data;
            })
            .error(function(data){
                console.log(data);
            });
    };

});