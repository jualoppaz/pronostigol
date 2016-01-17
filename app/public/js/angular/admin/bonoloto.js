var app = angular.module('dashboard');

app.controller('BonolotoController', function ($scope, $http){

    $scope.tickets = [];
    $scope.ticketAEliminar = {};

    $scope.mensajeInformativoEliminacion = "El ticket será eliminado de forma definitiva.";

    $scope.numOfPages;

    $scope.totalItems;

    $scope.currentPage = 1;
    $scope.ticketsPerPage = 10;


    $http.get('/api/bonoloto/tickets')
        .success(function(data){
            $scope.tickets = data;

            $scope.totalItems = $scope.tickets.length;

            $scope.numOfPages = $scope.tickets.length / $scope.ticketsPerPage;

            console.log("Numero de paginas: " + $scope.numOfPages);

            var floor = Math.floor($scope.tickets.length / $scope.ticketsPerPage);

            if($scope.numOfPages > floor){
                $scope.numOfPages = Math.floor($scope.tickets.length / $scope.ticketsPerPage) + 1;
            }

        })
        .error(function(data){
            console.log(data);
        });

    $scope.verTicket = function(id){
        window.location.href = "/admin/bonoloto/tickets/" + id;
    };

    $scope.eliminarTicket = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.ticketAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        $http.delete('/api/bonoloto/tickets/' + String($scope.ticketAEliminar))
            .success(function(data){
                $scope.tickets = data;
            })
            .error(function(data){
                console.log(data);
            });
    };
});