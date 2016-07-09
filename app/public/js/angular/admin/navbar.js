//var loginNavbar = angular.module('loginNavbar', [])

var app = angular.module('dashboard');

app.controller('NavbarController', function ($scope, $http, $window, $timeout){

    $scope.seccion = "";

    var url = $window.location.href;

    if(url.indexOf("/quiniela") != -1){
        $scope.seccion = "Quiniela";
        $scope.loteria = "quiniela";
    }else if(url.indexOf("/bonoloto") != -1){
        $scope.seccion = "Bonoloto";
        $scope.loteria = "bonoloto";
    }else if(url.indexOf("/primitiva") != -1){
        $scope.seccion = "Primitiva";
        $scope.loteria = "primitiva";
    }else if(url.indexOf("/gordo") != -1){
        $scope.seccion = "El Gordo";
        $scope.loteria = "gordo";
    }else if(url.indexOf("/euromillones") != -1){
        $scope.seccion = "Euromillones";
        $scope.loteria = "euromillones";
    }

    $scope.cerrarSesion = function(){
        $http.get('/api/logout')
            .success(function(data){
                    //alert("Ha cerrado sesión correctamente");

                /*angular.element("#modalTitleLogout").text("Sesión cerrada correctamente");
                angular.element("#modalTextLogout").text("Vuelva pronto.");
                angular.element("#modal-logout").modal('show');*/

                $scope.usuarioEstaLogueado = false;

                // La redireccion esta hecha en cliente, pero seria ideal conseguir hacerla desde el servidor.
                // El problema es que la redireccion no se lleva bien con las peticiones AJAX.

                $scope.redirigirTrasLogout();

            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigirTrasLogout = function(){
        /*$timeout(function() {
            $window.location.href = "/";
        }, 2000);
        */
        $window.location.href = "/";
    };

});