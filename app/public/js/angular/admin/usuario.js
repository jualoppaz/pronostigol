var app = angular.module('dashboard');

app.controller('UsuarioController', function ($scope, $http, $filter){

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


    /*

    $scope.opcionesBaneo = [
        {name: 'Sí'},
        {name: 'No'}
    ];

    $scope.opcionesActivo = [
        {name: 'Sí'},
        {name: 'No'}
    ];
    */


    var url = window.location.href;
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
                if(data == 'ok'){
                    angular.element("#modalTitleUsuarioEditadoCorrectamente").text("Edición correcta");
                    angular.element("#modalTextUsuarioEditadoCorrectamente").text("El usuario ha sido editado correctamente.");
                    angular.element("#modal-usuarioEditadoCorrectamente").modal('show');
                }
            })
            .error(function(data){
                alert(data);
                console.log(data);
                if(data == "username-taken"){
                    angular.element("#modalTitleUsuarioYaExiste").text("El usuario introducido ya existe");
                    angular.element("#modalTextUsuarioYaExiste").text("Introduzca un usuario diferente.");
                    angular.element("#modal-usuarioYaExiste").modal('show');
                }

            })
    };

    $scope.actualizarActivo = function(){
        alert($scope.usuario.estaActivo);
    };

    $scope.redirigirTrasEditar = function(){
        window.location.href = '/admin/usuarios';
    }

});