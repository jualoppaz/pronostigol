var app = angular.module('dashboard');

app.controller('UsuariosController', function ($scope, $http){

    $scope.usuarios = {};

    $scope.mensajeInformativoEliminacion = "El usuario será eliminado de forma definitiva.";

    $http.get('/api/users')
        .success(function(data){
            $scope.usuarios = data;
        })
        .error(function(data){
            alert("Ha sucedido algún error. Recargue la página.");
        });

    $scope.verUsuario = function(id){
        window.location.href = "/admin/usuarios/" + id;
    };

    $scope.eliminarUsuario = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.usuarioAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        $http.delete('/api/users/' + String($scope.usuarioAEliminar))
            .success(function(data){
                $scope.usuarios = data;
            })
            .error(function(data){

            });
    };
});