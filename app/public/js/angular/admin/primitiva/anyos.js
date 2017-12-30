var app = angular.module('dashboard');

app.controller('AnyosController', Controller);

Controller.$inject = ['$scope', '$http', 'primitiva'];

function Controller ($scope, $http, primitiva){

    $scope.anyos = {};
    $scope.anyoAEliminar = {};

    $scope.mensajeInformativoEliminacion = "Si acepta, el año será eliminado de forma definitiva.";

    $scope.form = {};

    $scope.form.mostrarTodos = true;

    $scope.form.letraSeleccionada = "A";

    primitiva.getAllYears()
        .then(function(data){
            $scope.anyos = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.verRegistro = function(id){
        window.location.href = "/admin/primitiva/anyos/" + id;
    };

    $scope.eliminarRegistro = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.anyoAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        primitiva.deleteYearById($scope.anyoAEliminar)
            .then(function(data){
                $scope.anyos = data;
            })
            .catch(function(err){
                console.log(err);
            });
    };
};