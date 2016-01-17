var app = angular.module('dashboard');

app.controller('EmailsController', function ($scope, $http){

    $scope.emails = {};
    $scope.emailAEliminar = {};



    $http.get('/api/emails')
        .success(function(data){
            $scope.emails = data;
        })
        .error(function(data){
            alert("Ha sucedido algún error. Recargue la página.");
        });





    $scope.verEmail = function(id){
        window.location.href = "/admin/emails/" + id;
    };

    $scope.eliminarEmail = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.emailAEliminar = id;
    };

    $scope.eliminarEmailDefinitivamente = function(){
        $http.delete('/api/emails/' + String($scope.emailAEliminar))
            .success(function(data){
                $scope.emails = data;
            })
            .error(function(data){

            })
    };
});