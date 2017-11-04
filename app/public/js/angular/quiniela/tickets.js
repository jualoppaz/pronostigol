var app = angular.module('qdb');

app.controller('QuinielasController', function ($scope, $http, $window) {

    $scope.tickets = [];

    $scope.numOfPages;

    $scope.totalItems;

    $scope.currentPage = 1;
    $scope.ticketsPerPage = 5;
    $scope.maxSize = 5;

    $scope.mostrarQuinielasDeTemporada = function(temporada){
        if($scope.tickets.length == 0 || $scope.tickets[0].temporada != temporada){
            $http.get('/api/quiniela/tickets/season/' + temporada)
                .success(function(data){
                    $scope.tickets = data;

                    $scope.totalItems = data.length;

                    $scope.numOfPages = data.length / $scope.ticketsPerPage;

                    console.log("Numero de paginas: " + $scope.numOfPages);

                    var floor = Math.floor(data.length / $scope.ticketsPerPage);

                    if($scope.numOfPages > floor){
                        $scope.numOfPages = Math.floor(data.length / $scope.ticketsPerPage) + 1;
                    }

                    $scope.paginas = [];

                    for(i=0;i<$scope.numOfPages;i++){
                        $scope.paginas[i] = i+1;
                    }

                })
                .error(function(data){
                    alert(data);
                });
        }
    };

    $scope.verTicket = function(ticket){
        $window.location.href = "/quiniela/tickets/" + ticket.temporada + "/" + ticket.jornada;
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