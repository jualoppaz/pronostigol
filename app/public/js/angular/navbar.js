var app = angular.module('qdb');

app.controller('NavbarController', function ($scope, $http, $window){

    /*
     Estos metodos han sido trasladados al LoguedUserController para que también puedan ser
     utilizados por los botones de la version movil.
      */


    /*
    $scope.cerrarSesion = function(){
        $http.get('/api/logout')
            .success(function(data){
                if(data == "ok"){
                    //alert("Ha cerrado sesión correctamente");

                    angular.element("#modalTitleLogout").text("Sesión cerrada correctamente");
                    angular.element("#modalTextLogout").text("Vuelva pronto.");
                    angular.element("#modal-logout").modal('show');

                    $scope.usuarioEstaLogueado = false;

                    // La redireccion esta hecha en cliente, pero seria ideal conseguir hacerla desde el servidor.
                    // El problema es que la redireccion no se lleva bien con las peticiones AJAX.

                }

            })
            .error(function(data){

            });
    };

    $scope.redirigirTrasLogout = function(){
        $window.location.href = "/";
    };
    */

});