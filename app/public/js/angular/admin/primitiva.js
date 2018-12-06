var app = angular.module('dashboard');

app.controller('PrimitivaController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'primitiva'];

function Controller ($scope, $http, $window, primitiva){

    $scope.tickets = [];
    $scope.ticketAEliminar = {};

    $scope.mensajeInformativoEliminacion = "El ticket será eliminado de forma definitiva.";
    
    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    primitiva.getTickets({
        page: $scope.currentPage,
        per_page: ticketsPerPage_default
    })
        .then(function (data) {
            var tickets = data.data;
            var perPage = data.perPage;
            var total = data.total;
            var numOfPages = total / perPage;

            $scope.tickets = tickets;

            $scope.totalItems = data.total;

            $scope.numOfPages = numOfPages;

            var floor = Math.floor(total / perPage);

            if (numOfPages > floor) {
                numOfPages = Math.floor(total / perPage) + 1;
            }

            $scope.numOfPages = numOfPages;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.verTicket = function(id){
        $window.location.href = "/admin/primitiva/tickets/" + id;
    };

    $scope.eliminarTicket = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.ticketAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        primitiva.deleteTicketById($scope.ticketAEliminar)
            .then(function(){
                return primitiva.getAllTickets();
            })
            .then(function(data){
                $scope.tickets = data;
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.consultarTickets = function () {

        $scope.reset();

        primitiva.getTickets({
            page: $scope.currentPage,
            per_page: $scope.ticketsPerPage
        })
            .then(function (data) {
                var tickets = data.data;
                var perPage = data.perPage;
                var total = data.total;
                var numOfPages = total / perPage;

                $scope.tickets = tickets;

                $scope.totalItems = data.total;

                $scope.numOfPages = numOfPages;

                var floor = Math.floor(total / perPage);

                if (numOfPages > floor) {
                    numOfPages = Math.floor(total / perPage) + 1;
                }

                $scope.numOfPages = numOfPages;
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    $scope.reset = function () {
        $scope.tickets = [];
    };
}