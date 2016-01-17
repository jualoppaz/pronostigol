var services = angular.module('services', []);

services.service('UserService', ['$http', function($http){

    this.solicitarUsuario = function(){
        return $http.get('/api/user');
    };

}]);

services.service('LoginService', ['$http', function($http){

    this.hacerLogin = function(form){
        return $http.post('/api/login', form);
    };

}]);

services.service('VariosService', [function(){

    this.traducirDia = function(dia){

        var res = "";

        if(dia == "Monday"){
            res = "Lunes";
        }else if(dia == "Tuesday"){
            res = "Martes";
        }else if(dia == "Wednesday"){
            res = "Miércoles";
        }else if(dia == "Thursday"){
            res = "Jueves";
        }else if(dia == "Friday"){
            res = "Viernes";
        }else if(dia == "Saturday"){
            res = "Sábado";
        }else if(dia == "Sunday"){
            res = "Domingo";
        }else{
            res = "-";
        }

        return res;
    };

    this.jsonVacio = function(json){

        var res = Object.keys(json).length == 0;
        console.log("Vacio: " + res);
        return res;
    };

    this.apuestaRealizada = function(ticket){
        var res = false;

        console.log(JSON.stringify(ticket));

        if(ticket != null){
            if(ticket.apuestas != null){
                if(ticket.apuestas.combinaciones.length > 0){
                    res = true;
                }
            }
        }
        return res;
    }

}]);





