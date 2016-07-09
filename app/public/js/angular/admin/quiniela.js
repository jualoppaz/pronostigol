var app = angular.module('dashboard');

app.controller('QuinielaController', function ($scope, $http, $window){

    $scope.tickets = [];
    $scope.quinielaAEliminar = {};

    $scope.numOfPages;

    $scope.totalItems;

    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    $http.get('/api/quiniela/tickets')
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

    $scope.verEmail = function(id){
        $window.location.href = "/admin/emails/" + id;
    };

    $scope.eliminarEmail = function(id){
        angular.element("#modal-eliminar-email").modal('show');
        $scope.emailAEliminar = id;
    };

    $scope.eliminarEmailDefinitivamente = function(){
        $http.delete('/api/emails/' + String($scope.emailAEliminar))
            .success(function(data){
                $scope.emails = data;
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.verQuiniela = function(season, id){
        $window.location.href = "/admin/quiniela/tickets/" + season + "/" + id;
    };
});