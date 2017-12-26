var app = angular.module('qdb');

app.controller('TicketsController', function ($scope, $http, $window, $filter, VariosService) {

    $scope.tickets = [];

    $scope.numOfPages;
    $scope.totalItems;
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.ticketsPerPage = 5;

    $scope.mostrarTickets = function(anyo){
        if($scope.tickets.length == 0 || $scope.tickets[0].anyo != anyo){
            $http.get('/api/primitiva/tickets', {
                params: {
                    year: anyo
                }
            })
            .success(function(data){
                $scope.tickets = data;
                $scope.totalItems = data.length;
                $scope.numOfPages = data.length / $scope.ticketsPerPage;

                var floor = Math.floor(data.length / $scope.ticketsPerPage);

                if($scope.numOfPages > floor){
                    $scope.numOfPages = Math.floor(data.length / $scope.ticketsPerPage) + 1;
                }

                $scope.paginas = [];

                for(var i=0; i<$scope.numOfPages; i++){
                    $scope.paginas[i] = i+1;
                }

            })
            .error(function(data){
                console.log(data);
            });
        }
    };

    $scope.verTicket = function(ticket){
        $window.location.href = "/primitiva/tickets/" + ticket.anyo + "/" + ticket.sorteo;
    };

    $scope.traducirDia = function(fecha){

        var dia = $filter('date')(fecha, 'EEEE');
        return VariosService.traducirDia(dia);
    };


    // Paginacion manual

    $scope.actualizarPagina = function(pagina){
        $scope.currentPage = pagina;
    };

    $scope.propiedad = 'fecha';

    $scope.apuestaRealizada = function(ticket){
        return VariosService.apuestaRealizada(ticket);
    };

});