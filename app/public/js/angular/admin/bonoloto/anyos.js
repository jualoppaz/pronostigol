var app = angular.module('dashboard');

app.controller('AnyosController', Controller);

Controller.$inject = ['$scope', '$http', 'bonoloto'];

function Controller ($scope, $http, bonoloto){

    $scope.anyos = {};
    $scope.anyoAEliminar = {};

    $scope.mensajeInformativoEliminacion = "Si acepta, el año será eliminado de forma definitiva.";

    $scope.form = {};

    $scope.form.mostrarTodos = true;

    $scope.form.letraSeleccionada = "A";

    bonoloto.getYears()
        .then(function(data){
            console.log("Respuesta de años:", data);
            $scope.anyos = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.verRegistro = function(id){
        window.location.href = "/admin/bonoloto/anyos/" + id;
    };

    $scope.eliminarRegistro = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.anyoAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        bonoloto.deleteYearById($scope.anyoAEliminar)
            .then(function(){
                return bonoloto.getYears();
            })
            .then(function(data){
                $scope.anyos = data;
            })
            .catch(function(err){
                console.log(err);
            });
    };
}