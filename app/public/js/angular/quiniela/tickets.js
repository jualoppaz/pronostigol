var app = angular.module('qdb');

app.controller('QuinielasController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela) {

    $scope.tickets = [];
    
    $scope.currentPage = 1;
    $scope.ticketsPerPage = 5;
    $scope.maxSize = 5;

    $scope.selected = {
        season: null
    };

    quiniela.getAllSeasons()
        .then(function(data){

            var seasons = [];

            for(var i=0; i<data.length; i++){
                var season = data[i];

                if(season.value !== "Histórico"){
                    seasons.push(season);
                }
            }

            $scope.seasons = seasons;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.mostrarTickets = function(temporada){
        if($scope.tickets.length == 0 || $scope.tickets[0].temporada != temporada){
            quiniela.getAllTicketsBySeason(temporada)
                .then(function(data){
                    $scope.tickets = data;

                    $scope.totalItems = data.length;

                    $scope.numOfPages = data.length / $scope.ticketsPerPage;

                    var floor = Math.floor(data.length / $scope.ticketsPerPage);

                    if($scope.numOfPages > floor){
                        $scope.numOfPages = Math.floor(data.length / $scope.ticketsPerPage) + 1;
                    }
                })
                .catch(function(err){
                    console.log(err);
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
}