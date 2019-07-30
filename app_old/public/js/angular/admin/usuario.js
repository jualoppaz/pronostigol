var app = angular.module('dashboard');

app.controller('UsuarioController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter'];

function Controller($scope, $http, $window, $filter){

    // Este usuario es el actual del sistema

    $scope.usuario = {};


    // Este usuario parte con los datos actuales, pero es el que se modifica y se envia
    // al servidor


    $scope.opcionesBaneo = [
        {
            name: 'Sí',
            value: true
        },{
            name: 'No',
            value: false
        }
    ];

    $scope.opcionesActivo = [
        {
            name: 'Sí',
            value: true
        },{
            name: 'No',
            value: false
        }
    ];

    $scope.opcionesRoles = [
        {
            name: 'Privilegiado',
            value: 'privileged'
        },{
            name: 'Administrador',
            value: 'admin'
        },{
            name: 'Básico',
            value: 'basic'
        }
    ];

    var url = $window.location.href;
    var usuarioId = url.split("/")[url.split("/").length-1];

    $http.get('/api/users/' + String(usuarioId))
        .success(function(data){
            $scope.usuario = data;
            $scope.usuario.pass = "";

        })
        .error(function(data){
            console.log(data);
        });

    $scope.guardar = function(){
        $http.put('/api/users', $scope.usuario)
            .success(function(data){
                if(data === 'ok'){
                    $scope.redirigir();
                }
            })
            .error(function(data){
                if(data === "username-taken"){
                    angular.element("#modalTitleUsuarioYaExiste").text("El usuario introducido ya existe");
                    angular.element("#modalTextUsuarioYaExiste").text("Introduzca un usuario diferente.");
                    angular.element("#modal-usuarioYaExiste").modal('show');
                }

            });
    };

    $scope.actualizarActivo = function(){
        alert($scope.usuario.estaActivo);
    };

    $scope.redirigir = function(){
        $window.location.href = '/admin/usuarios';
    }
}