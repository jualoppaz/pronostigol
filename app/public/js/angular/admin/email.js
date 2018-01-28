var app = angular.module('dashboard');

app.controller('EmailController', Controller);

Controller.$inject = ['$scope', '$http', '$window'];

function Controller($scope, $http, $window){

    $scope.email = {};

    var url = $window.location.href;
    var emailId = url.split("/")[url.split("/").length-1];

    $http.get('/api/emails/' + String(emailId))
        .success(function(data){
            $scope.email = data;
        })
        .error(function(data){

        });
}