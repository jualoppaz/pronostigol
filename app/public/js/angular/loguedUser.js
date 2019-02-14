// Controlador Base. Por eso es el único que tiene dependencias

var app = angular.module("qdb", [
    "services",
    "ui.bootstrap",
    "ngSanitize",
    "ui.select",
    "bonoloto",
    "euromillones",
    "quiniela",
    "primitiva",
    "gordo",
    "detectAdblock"
]);

app.config(function(uiSelectConfig, adblockProvider) {
    uiSelectConfig.theme = "bootstrap";

    adblockProvider.title = "Adblock detectado";
    adblockProvider.description =
        "Parece que tu navegador está utilizando el plugin Adblock. Dado que nuestra publicidad no es abusiva y es nuestra única vía de financiación, es necesario que desactives Adblock para el dominio pronostigol.es. Gracias por tu comprensión.";
    adblockProvider.cancel = false; // Cancel button in alert
    adblockProvider.cancelText = "Cancelar";
    adblockProvider.refresh = true; // I have Dısable Adblock button in alert
    adblockProvider.refreshText = "He desactivado Adblock";
});

app.controller("LoguedUserController", Controller);

Controller.$inject = ["$scope", "UserService", "$http", "$window"];

function Controller($scope, UserService, $http, $window) {
    $scope.usuarioEstaLogueado = false;

    $scope.usuarioLogueado = {};

    getUser();

    function getUser() {
        UserService.solicitarUsuario()
            .success(function(data) {
                $scope.usuarioEstaLogueado = true;
                $scope.usuarioLogueado = data;
            })
            .error(function(data) {
                if (data === "not-loguedin-user") {
                    $scope.usuarioEstaLogueado = false;
                }
            });
    }

    $scope.cerrarSesion = function() {
        $http
            .get("/api/logout")
            .success(function() {
                $scope.usuarioEstaLogueado = false;
                $scope.redirigir();
            })
            .error(function(data) {
                console.log(data);
            });
    };

    $scope.redirigir = function() {
        $window.location.reload();
    };
}

app.run(function(adblock) {
    adblock.detect();
});
