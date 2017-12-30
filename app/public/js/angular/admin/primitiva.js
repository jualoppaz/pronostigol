var app = angular.module('dashboard');

app.controller('PrimitivaController', Controller);

Controller.$inject = ['$scope', '$http', 'primitiva'];

function Controller ($scope, $http, primitiva){

    $scope.tickets = [];
    $scope.ticketAEliminar = {};

    $scope.mensajeInformativoEliminacion = "El ticket será eliminado de forma definitiva.";

    $scope.numOfPages;

    $scope.totalItems;

    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    primitiva.getAllTickets()
        .then(function(data){
            $scope.tickets = data;

            $scope.totalItems = $scope.tickets.length;

            $scope.numOfPages = $scope.tickets.length / $scope.ticketsPerPage;

            console.log("Numero de paginas: " + $scope.numOfPages);

            var floor = Math.floor($scope.tickets.length / $scope.ticketsPerPage);

            if($scope.numOfPages > floor){
                $scope.numOfPages = Math.floor($scope.tickets.length / $scope.ticketsPerPage) + 1;
            }
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.verTicket = function(id){
        window.location.href = "/admin/primitiva/tickets/" + id;
    };

    $scope.eliminarTicket = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.ticketAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        primitiva.deleteTicketById($scope.ticketAEliminar)
            .then(function(data){
                return primitiva.getAllTickets();
            })
            .then(function(data){
                $scope.tickets = data;
            })
            .catch(function(err){
                console.log(err);
            });
    };
};