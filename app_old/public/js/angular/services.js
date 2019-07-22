var services = angular.module("services", []);

services.service("UserService", [
    "$http",
    function($http) {
        this.solicitarUsuario = function() {
            return $http.get("/api/user");
        };
    }
]);

services.service("LoginService", [
    "$http",
    function($http) {
        this.hacerLogin = function(form) {
            return $http.post("/api/login", form);
        };
    }
]);

services.service("VariosService", [
    function() {
        this.jsonVacio = function(json) {
            var res =
                json === null ||
                json === undefined ||
                Object.keys(json).length == 0;
            return res;
        };

        this.apuestaRealizada = function(ticket) {
            var res = false;

            if (ticket != null) {
                if (ticket.apuestas != null) {
                    if (ticket.apuestas.combinaciones.length > 0) {
                        res = true;
                    }
                }
            }
            return res;
        };
    }
]);
