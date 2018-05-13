var app = angular.module('dashboard');

app.controller('QuinielaController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.tickets = [];
    $scope.quinielaAEliminar = {};
    
    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    quiniela.getAllTickets({
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

    $scope.verQuiniela = function(season, id){
        $window.location.href = "/admin/quiniela/tickets/" + season + "/" + id;
    };

    $scope.consultarTickets = function(){

        $scope.reset();

        quiniela.getAllTickets({
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