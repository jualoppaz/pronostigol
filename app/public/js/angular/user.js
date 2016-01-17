function userController($scope, $http){

    $scope.usuarioEstaLogueadoParent = false;

    $scope.loguedUser = {};

    $http.get('/api/user')
        .success(function(data){
            $scope.usuarioEstaLogueadoParent = true;
            $scope.loguedUser = data;
        })
        .error(function(data){
            if(data == "not-loguedin-user"){
                $scope.usuarioEstaLogueadoParent = false;
            }
        });

}