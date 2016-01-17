var app = angular.module('dashboard');

app.controller('AnyosController', function ($scope, $http){

    $scope.anyos = {};
    $scope.anyoAEliminar = {};

    $scope.mensajeInformativoEliminacion = "Si acepta, el año será eliminado de forma definitiva.";

    $scope.form = {};

    $scope.form.mostrarTodos = true;

    $scope.form.letraSeleccionada = "A";

    $http.get('/api/gordo/years')
        .success(function(data){
            $scope.anyos = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.verRegistro = function(id){
        window.location.href = "/admin/gordo/anyos/" + id;
    };

    $scope.eliminarRegistro = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.anyoAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        $http.delete('/api/gordo/years/' + String($scope.anyoAEliminar))
            .success(function(data){
                $scope.anyos = data;
            })
            .error(function(data){
                console.log(data);
            });
    };

});