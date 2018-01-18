var app = angular.module('qdb');

app.controller('TicketsController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'VariosService', 'euromillones'];

function Controller($scope, $http, $window, $filter, VariosService, euromillones) {
    $scope.tickets = [];
    $scope.numOfPages;
    $scope.totalItems;
    $scope.maxSize = 5;
    $scope.currentPage = 1;
    $scope.ticketsPerPage = 5;

    euromillones.getAllYears()
        .then(function(data){
            $scope.years = $filter('orderBy')(data, "name");
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.mostrarTickets = function(anyo){
        if($scope.tickets.length === 0 || $scope.tickets[0].anyo != anyo){
            euromillones.getAllTickets({
                year: anyo
            })
                .then(function(data){
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
                .catch(function(err){
                    console.log(err);
                });
        }
    };

    $scope.verTicket = function(ticket){
        $window.location.href = "/euromillones/tickets/" + ticket.anyo + "/" + ticket.sorteo;
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
}