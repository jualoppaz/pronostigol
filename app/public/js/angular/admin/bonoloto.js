var app = angular.module('dashboard');

app.controller('BonolotoController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'bonoloto'];

function Controller ($scope, $http, $window, bonoloto){

    $scope.tickets = [];
    $scope.ticketAEliminar = {};

    $scope.mensajeInformativoEliminacion = "El ticket será eliminado de forma definitiva.";

    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    bonoloto.getTickets({
        page: $scope.currentPage,
        per_page: ticketsPerPage_default
    })
        .then(function(data){
            var tickets = data.data;
            var perPage = data.perPage;
            var total = data.total;
            var numOfPages = total / perPage;

            $scope.tickets = tickets;

            $scope.totalItems = data.total;

            $scope.numOfPages = numOfPages;

            var floor = Math.floor(total / perPage);

            if(numOfPages > floor){
                numOfPages = Math.floor(total / perPage) + 1;
            }

            $scope.numOfPages = numOfPages;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.verTicket = function(id){
        $window.location.href = "/admin/bonoloto/tickets/" + id;
    };

    $scope.eliminarTicket = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.ticketAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        bonoloto.deleteTicketById($scope.ticketAEliminar)
            .then(function(){
                return bonoloto.getTickets({
                    page: $scope.currentPage,
                    per_page: $scope.ticketsPerPage
                });
            })
            .then(function(data){
                $scope.tickets = data.data;
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.consultarTickets = function(){

        $scope.reset();

        bonoloto.getTickets({
            page: $scope.currentPage,
            per_page: $scope.ticketsPerPage
        })
            .then(function(data){
                var tickets = data.data;
                var perPage = data.perPage;
                var total = data.total;
                var numOfPages = total / perPage;

                $scope.tickets = tickets;

                $scope.totalItems = data.total;

                $scope.numOfPages = numOfPages;

                var floor = Math.floor(total / perPage);

                if(numOfPages > floor){
                    numOfPages = Math.floor(total / perPage) + 1;
                }

                $scope.numOfPages = numOfPages;
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.reset = function(){
        $scope.tickets = [];
    };
}