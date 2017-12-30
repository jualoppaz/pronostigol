var app = angular.module('qdb');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', 'VariosService', 'primitiva'];

function Controller ($scope, $http, VariosService, primitiva) {

    $scope.ticket = {};

    $scope.consultaRealizada = false;

    $scope.aciertos = [];

    var url = window.location.href;

    var fragmentos = url.split("/");

    primitiva.getAllTickets({
        year: fragmentos[5],
        raffle: fragmentos[6]
    })
        .then(function(data){
            $scope.ticket = data[0];
            $scope.consultaRealizada = true;
        })
        .catch(function(err){
            $scope.consultaRealizada = true;
            console.log(err);
        });

    $scope.determinarCategoriaPremio = function(combinacion){
        var res = "";
        var resultado = $scope.ticket.resultado;
        var numeroAciertos = 0;
        var reintegroAcertado = false;
        var complementarioAcertado = false;

        if($scope.ticket.apuestas.reintegro == resultado.reintegro){ // 0<=R<=9. Por tanto, podemos tener cualquier categoría.
            var reintegroAcertado = true;

            for(i=0; i<combinacion.length; i++){
                for(j=0; j<resultado.bolas.length; j++){
                    if(combinacion[i].numero == resultado.bolas[j].numero){
                        numeroAciertos += 1;
                    }
                }
            }

            if(numeroAciertos == 5){
                for(i=0; i<combinacion.length; i++){
                    for(j=0; j<resultado.bolas.length; j++){
                        if(combinacion[i].numero == resultado.complementario){
                            complementarioAcertado = true;
                            break;
                        }
                    }
                }
            }

        }else{ // Se puede acertar 6, 5, 4 o 3
            for(i=0; i<combinacion.length; i++){
                for(j=0; j<resultado.bolas.length; j++){
                    if(combinacion[i].numero == resultado.bolas[j].numero){
                        numeroAciertos += 1;
                    }
                }
            }

            if(numeroAciertos == 5){
                for(var i=0; i<combinacion.length; i++){
                    for(var j=0; j<resultado.bolas.length; j++){
                        if(combinacion[i].numero == resultado.complementario){
                            complementarioAcertado = true;
                            break;
                        }
                    }
                }
            }
        }

        if(numeroAciertos == 6){
            if(reintegroAcertado){
                res = "Especial";
            }else{
                res = "1ª"
            }
        }else if(numeroAciertos == 5){
            if(complementarioAcertado){
                res = "2ª";
            }else{
                res = "3ª";
            }
        }else if(numeroAciertos == 4){
            res = "4ª";
        }else if(numeroAciertos == 3){
            res = "5ª";
        }else if(reintegroAcertado){
            res = "R";
        }else{
            res = "-";
        }

        return res;

    };

    $scope.determinarNumeroAciertos = function(combinacion){

        var res = "";

        var resultado = $scope.ticket.resultado;

        var numeroAciertos = 0;

        var reintegroAcertado = false;

        var complementarioAcertado = false;

        if($scope.ticket.apuestas.reintegro == resultado.reintegro){ // 0<=R<=9. Por tanto, podemos tener cualquier categoría.
            var reintegroAcertado = true;

            for(i=0; i<combinacion.length; i++){
                for(j=0; j<resultado.bolas.length; j++){
                    if(combinacion[i].numero == resultado.bolas[j].numero){
                        numeroAciertos += 1;
                    }
                }
            }

            if(numeroAciertos == 5){
                for(i=0; i<combinacion.length; i++){
                    for(j=0; j<resultado.bolas.length; j++){
                        if(combinacion[i].numero == resultado.complementario){
                            complementarioAcertado = true;
                            break;
                        }
                    }
                }
            }

        }else{ // Se puede acertar 6, 5, 4 o 3
            for(i=0; i<combinacion.length; i++){
                for(j=0; j<resultado.bolas.length; j++){
                    if(combinacion[i].numero == resultado.bolas[j].numero){
                        numeroAciertos += 1;
                    }
                }
            }

            if(numeroAciertos == 5){
                for(var i=0; i<combinacion.length; i++){
                    for(var j=0; j<resultado.bolas.length; j++){
                        if(combinacion[i].numero == resultado.complementario){
                            complementarioAcertado = true;
                            break;
                        }
                    }
                }
            }
        }

        if(numeroAciertos == 6){
            if(reintegroAcertado){
                res = "6 + R";
            }else{
                res = "6";
            }
        }else if(numeroAciertos == 5){
            if(complementarioAcertado){
                res = "5 + C";
            }else{
                res = "5";
            }
        }else if(numeroAciertos == 4){
            res = "4";
        }else if(numeroAciertos == 3){
            res = "3";
        }else if(numeroAciertos == 2){
            res = "2";
        }else if(numeroAciertos == 1){
            res = "1";
        }else{
            res = "0";
        }

        return res;

    };

    $scope.bolaHaSidoAcertada = function(bola){
        var resultado = $scope.ticket.resultado;
        var res = false;

        for(var i=0; i<resultado.bolas.length; i++){
            if(bola.numero == resultado.bolas[i].numero){
                res = true;
                break;
            }
        }

        return res;
    };

    $scope.bolaHaSidoAcertadaComoComplementario = function(bola){

        var resultado = $scope.ticket.resultado;

        var res = false;

        res = bola.numero == resultado.complementario;

        return res;
    };

    $scope.ticketEstaVacio = function(){
        return VariosService.jsonVacio($scope.ticket);
    };
};