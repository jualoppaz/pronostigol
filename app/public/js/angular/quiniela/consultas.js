var app = angular.module('qdb');

app.controller('ConsultasController', Controller);

Controller.$inject = ['$scope', '$http', '$filter', 'quiniela'];

function Controller ($scope, $http, $filter, quiniela) {

    $scope.mostrar = null;

    $scope.form = {};

    $scope.form.opcionBusqueda = "general";

    $scope.form.opcionBusquedaEstandar = "combinacionesSucedidas";

    $scope.primeraPestana = true;

    $scope.segundaPestana = false;

    $scope.consultando = false;

    $scope.mostrarPlenoRenovado = false;

    $scope.mostrarPlenoRenovadoLocalYVisitante = false;

    $scope.mostrarLocalYVisitante = false;

    $scope.victoriasLocales = [];

    $scope.empates = [];

    $scope.victoriasVisitantes = [];

    $scope.victoriasLocalesComoLocal = [];

    $scope.empatesComoLocal = [];

    $scope.victoriasVisitantesComoLocal = [];

    $scope.victoriasLocalesComoVisitante = [];

    $scope.empatesComoVisitante = [];

    $scope.victoriasVisitantesComoVisitante = [];

    $scope.filas = [];

    $scope.filasLocal = [];

    $scope.filasVisitante = [];

    $scope.resultadosPlenoRenovado = [
        '0-0', '0-1', '0-2', '0-M', '1-0', '1-1', '1-2', '1-M',
        '2-0', '2-1', '2-2', '2-M', 'M-0', 'M-1', 'M-2', 'M-M'
    ];

    $scope.ayudaTemporada = "Para buscar datos sobre todas " +
        "las temporadas o sobre una única temporada.";

    $scope.ayudaCompeticion = "Para buscar datos sobre todas " +
        "las competiciones o sobre una concreta.";

    $scope.ayudaBusqueda = "Para añadir un criterio adicional de búsqueda. " +
        "Se pueden buscar resultados en general, los datos de un equipo o sólo los de un partido.";

    $scope.ayudaCombinacionesOcurrencia = "Para consultar las combinaciones que se han dado en la historia y " +
        "el número de veces que se han repetido.";

    $scope.plenosRenovados = {};

    $scope.plenosRenovadosLocal = {};

    $scope.plenosRenovadosVisitante = {};

    $scope.sumaDeVictoriasLocales = function(){
        var suma = 0;
        for(var i=0; i<$scope.filas.length; i++){
            suma = suma + $scope.filas[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpates = function(){
        var suma = 0;
        for(var i=0; i<$scope.filas.length; i++){
            suma = suma + $scope.filas[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantes = function(){
        var suma = 0;
        for(var i=0; i<$scope.filas.length; i++){
            suma = suma + $scope.filas[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoLocal = function(){
        var suma = 0;
        for(var i=0; i<$scope.filasLocal.length; i++){
            suma = suma + $scope.filasLocal[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoLocal = function(){
        var suma = 0;
        for(var i=0; i<$scope.filasLocal.length; i++){
            suma = suma + $scope.filasLocal[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoLocal = function(){
        var suma = 0;
        for(var i=0; i<$scope.filasLocal.length; i++){
            suma = suma + $scope.filasLocal[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoVisitante = function(){
        var suma = 0;
        for(var i=0; i<$scope.filasVisitante.length; i++){
            suma = suma + $scope.filasVisitante[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoVisitante = function(){
        var suma = 0;
        for(var i=0; i<$scope.filasVisitante.length; i++){
            suma = suma + $scope.filasVisitante[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoVisitante = function(){
        var suma = 0;
        for(var i=0; i<$scope.filasVisitante.length; i++){
            suma = suma + $scope.filasVisitante[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.limpiarTablas = function(){
        $scope.filas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

        $scope.victoriasLocales = [];
        $scope.victoriasVisitantes = [];
        $scope.empates = [];

        $scope.victoriasLocalesComoLocal = [];
        $scope.empatesComoLocal = [];
        $scope.victoriasVisitantesComoLocal = [];

        $scope.victoriasLocalesComoVisitante = [];
        $scope.empatesComoVisitante = [];
        $scope.victoriasVisitantesComoVisitante = [];

        $scope.plenosRenovados = {};

        $scope.plenosRenovadosLocal = {};

        $scope.plenosRenovadosVisitante = {};

        $scope.mostrar = false;

        $scope.mostrarPlenoRenovado = false;

        $scope.mostrarPlenoRenovadoLocalYVisitante = false;

        $scope.mostrarLocalYVisitante = false;

        $scope.consultando = true;
    };


    $scope.situacionDelPrimero = function(primero, segundo, tercero){

        var res = "";

        if(primero > segundo && primero > tercero){
            // Caso 1: El primero es el mayor en solitario

            res = "mayorEnSolitario";
        }else if(primero == segundo && primero > tercero){

            // Caso 2.1: El primero es el mayor empatado con alguno
            res = "mayorCompartido";
        }else if(primero > segundo && primero == tercero){

            // Caso 2.2: El primero es el mayor empatado con alguno
            res = "mayorCompartido";
        }else if(primero < segundo && primero < tercero){
            // Caso 3: El primero es el menor en solitario

            res = "menorEnSolitario";
        }else if(primero == segundo && primero < tercero){

            // Caso 4.1: El primero es el menor empatado con alguno
            res = "menorCompartido";
        }else if(primero < segundo && primero == tercero){

            // Caso 4.2: El primero es el menor empatado con alguno
            res = "menorCompartido";
        }else if(primero < segundo && primero > tercero){

            //Caso 5.1: Está en medio

            res = "intermedio";
        }else if(primero > segundo && primero < tercero){

            //Caso 5.2: Está en medio

            res = "intermedio";
        }else if(primero == segundo && segundo == tercero){

            //Caso 5: Todos suman lo mismo

            res = "igualados";
        }

        return res;

    };


    $scope.cargarTabla = function(data){
        $scope.limpiarTablas();
        $scope.data = data;
        $scope.plenosRenovados = data.plenosRenovados;
        $scope.filas = data.filas;

        if($scope.filas.length < 15){
            $scope.filasAux = $scope.filas;

            for(var i=1; i<=15; i++){
                var hayDatos = false;

                for(var f=0; f<$scope.filasAux.length; f++){

                    if($scope.filasAux[f].fila == i){
                        hayDatos = true;
                        break;
                    }
                }

                if(!hayDatos){
                    var json = {
                        fila: i,
                        victoriasLocales: 0,
                        empates: 0,
                        victoriasVisitantes: 0
                    };

                    $scope.filas.push(json);
                }
            }
        }

        if(data.plenosRenovados){
            for(i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var key = $scope.resultadosPlenoRenovado[i];
                if($scope.plenosRenovados[key] == null){
                    $scope.plenosRenovados[key] = 0;
                }
            }

            $scope.mostrarPlenoRenovado = true;
        }
    };

    $scope.cargarTablaLocal = function(data){
        $scope.plenosRenovadosLocal = data.plenosRenovados;
        $scope.filasLocal = data.filas;

        if($scope.filasLocal.length < 15){
            $scope.filasAux = $scope.filasLocal;

            for(var i=1; i<=15; i++){
                var hayDatos = false;

                for(var f=0; f<$scope.filasAux.length; f++){
                    if($scope.filasAux[f].fila == i){
                        hayDatos = true;
                        break;
                    }
                }

                if(!hayDatos){
                    var json = {
                        fila: i,
                        victoriasLocales: 0,
                        empates: 0,
                        victoriasVisitantes: 0
                    };

                    $scope.filasLocal.push(json);
                }
            }
        }

        /*
            TODO Cuando el campo "fila" se cambie en la base de datos de String a Number no hara
            falta hacer esto
        */

        $scope.filasLocal = $filter('orderBy')($scope.filasLocal, 'fila');

        if(data.plenosRenovados){
            for(i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var key = $scope.resultadosPlenoRenovado[i];
                if($scope.plenosRenovadosLocal[key] == null){
                    $scope.plenosRenovadosLocal[key] = 0;
                }
            }

            $scope.mostrarPlenoRenovadoLocalYVisitante = true;
        }
    };

    $scope.cargarTablaVisitante = function(data){
        $scope.plenosRenovadosVisitante = data.plenosRenovados;
        $scope.filasVisitante = data.filas;
        if($scope.filasVisitante.length < 15){
            $scope.filasAux = $scope.filasVisitante;

            for(var i=1; i<=15; i++){

                var hayDatos = false;

                for(var f=0; f<$scope.filasAux.length; f++){
                    if($scope.filasAux[f].fila == i){
                        hayDatos = true;
                        break;
                    }
                }

                if(!hayDatos){
                    var json = {
                        fila: i,
                        victoriasLocales: 0,
                        empates: 0,
                        victoriasVisitantes: 0
                    };

                    $scope.filasVisitante.push(json);
                }
            }
        }

        $scope.filasVisitante = $filter('orderBy')($scope.filasVisitante, 'fila');

        if(data.plenosRenovados){
            for(i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var key = $scope.resultadosPlenoRenovado[i];
                if($scope.plenosRenovadosVisitante[key] == null){
                    $scope.plenosRenovadosVisitante[key] = 0;
                }
            }

            $scope.mostrarPlenoRenovadoLocalYVisitante = true;
        }
    };

    $scope.consultar = function(){

        $scope.limpiarTablas();

        var temporada = $scope.form.temporadaSeleccionada;
        var competicion = $scope.form.competicionSeleccionada;
        var opcionBusqueda = $scope.form.opcionBusqueda;
        var equipo = $scope.form.equipoSeleccionado;
        var equipoLocal = $scope.form.equipoLocalSeleccionado;
        var equipoVisitante = $scope.form.equipoVisitanteSeleccionado;

        console.log("Competicion: " + competicion);

        console.log("Temporada: " + temporada);

        console.log("Opcion busqueda: " + opcionBusqueda);

        if(temporada == 'Histórico' || temporada == null || temporada == ""){

            if(competicion == 'Todas' || competicion == null || competicion == ""){
                if(opcionBusqueda == "general"){
                    quiniela.getHistorical()
                        .then(function(data){
                            $scope.cargarTabla(data);

                            $scope.mostrar = true;

                            $scope.consultando = false;
                        })
                        .catch(function(err){
                            console.log(err);
                            $scope.mostrar = false;

                            $scope.consultando = false;
                        });
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == "" || equipo == null){
                        alert("Debe introducir un equipo.");
                        $scope.consultando = false;
                    }else{ // Se ha introducido un equipo

                        quiniela.getHistoricalByLocalTeam(equipo)
                            .then(function(data){
                                $scope.cargarTablaLocal(data);

                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;
                            });

                        quiniela.getHistoricalByVisitorTeam(equipo)
                            .then(function(data){
                                $scope.cargarTablaVisitante(data);

                                $scope.mostrarLocalYVisitante = true;
                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;
                            });
                    }
                }else if(opcionBusqueda == "partido"){

                    if(equipoLocal == null || equipoLocal == ""){
                        if(equipoVisitante == null || equipoVisitante == ""){
                            alert("Debe introducir 2 equipos");
                            $scope.consultando = false;
                        }else{
                            alert("Debe introducir el equipo local.");
                            $scope.consultando = false;
                        }
                    }else{
                        if(equipoVisitante == null || equipoVisitante == ""){
                            alert("Debe introducir el equipo visitante.");
                            $scope.consultando = false;
                        }else{
                            quiniela.getHistoricalByLocalAndVisitorTeam(equipoLocal, equipoVisitante)
                                .then(function(data){
                                    $scope.cargarTabla(data);

                                    $scope.mostrar = true;
                                    $scope.consultando = false;
                                })
                                .catch(function(err){
                                    console.log(err);
                                    $scope.mostrar = false;
                                    $scope.consultando = false;
                                });
                        }
                    }
                }

            }else{
                if(opcionBusqueda == "general"){
                    quiniela.getHistoricalByCompetition(competicion)
                        .then(function(data){
                            $scope.cargarTabla(data);

                            $scope.mostrar = true;
                            $scope.consultando = false;
                        })
                        .catch(function(err){
                            console.log(err);
                            $scope.mostrar = false;
                            $scope.consultando = false;
                        });
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                        $scope.consultando = false;
                    }else{
                        quiniela.getHistoricalByCompetitionAndLocalTeam(competicion, equipo)
                            .then(function(data){
                                $scope.cargarTablaLocal(data);

                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;
                            });

                        quiniela.getHistoricalByCompetitionAndVisitorTeam(competicion, equipo)
                            .then(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;
                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;
                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        quiniela.getHistoricalByCompetitionAndLocalAndVisitorTeam(competicion, equipoLocal, equipoVisitante)
                            .then(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;
                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrar = false;
                                $scope.consultando = false;
                            });
                    }
                }
            }
        }else{
            if(competicion == 'Todas' || competicion == null || competicion == ""){
                if(opcionBusqueda == "general"){
                    quiniela.getHistoricalBySeason(temporada)
                        .then(function(data){
                            $scope.cargarTabla(data);
                            $scope.mostrar = true;

                            $scope.consultando = false;
                        })
                        .catch(function(err){
                            console.log(err);
                            $scope.mostrar = false;

                            $scope.consultando = false;
                        });
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                    }else{
                        quiniela.getHistoricalBySeasonAndLocalTeam(temporada, equipo)
                            .then(function(data){
                                $scope.cargarTablaLocal(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;
                            });

                        quiniela.getHistoricalBySeasonAndVisitorTeam(temporada, equipo)
                            .then(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;
                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        quiniela.getHistoricalBySeasonAndLocalAndVisitorTeam(temporada, equipoLocal, equipoVisitante)
                            .then(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrar = false;

                                $scope.consultando = false;
                            });
                    }
                }
            }else{ // Se ha seleccionado una competicion
                if(opcionBusqueda == "general"){
                    quiniela.getHistoricalBySeasonAndCompetition(temporada, competicion)
                        .then(function(data){
                            $scope.cargarTabla(data);
                            $scope.mostrar = true;

                            $scope.consultando = false;
                        })
                        .catch(function(err){
                            console.log(err);
                            $scope.mostrar = false;

                            $scope.consultando = false;
                        });
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                    }else{ // Se ha introducido un equipo
                        quiniela.getHistoricalBySeasonCompetitionAndLocalTeam(temporada, competicion, equipo)
                            .then(function(data){
                                $scope.cargarTablaLocal(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;
                            });

                        quiniela.getHistoricalBySeasonCompetitionAndVisitorTeam(temporada, competicion, equipo)
                            .then(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;
                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){

                        quiniela.getHistoricalBySeasonCompetitionAndLocalAndVisitorTeam(temporada, competicion,
                            equipoLocal, equipoVisitante)
                            .then(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;

                                $scope.consultando = false;
                            })
                            .catch(function(err){
                                console.log(err);
                                $scope.mostrar = false;

                                $scope.consultando = false;
                            });
                    }
                }
            }
        }

    };

    $scope.resultadoPlenoMasFrecuenteEnSolitario = function(partidos, resultado, cantidad){
        cantidad = cantidad || 0;

        if(typeof(resultado) != 'undefined' && typeof(cantidad) != 'undefined'){
            for(var i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var res = true;
                var resultadoAux = $scope.resultadosPlenoRenovado[i];

                if(resultadoAux != resultado){
                    var cantidadAux = partidos[resultadoAux] || 0;

                    if(Number(cantidadAux) >= Number(cantidad)){
                        res = false;
                        break;
                    }
                }
            }
        }

        return res;
    };


    $scope.resultadoPlenoMasFrecuenteEmpatado = function(partidos, resultado, cantidad){
        var res = true;
        var repetidos = 0;

        cantidad = cantidad || 0;

        if(typeof(resultado) != 'undefined' && typeof(cantidad) != 'undefined'){

            for(var i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var resultadoAux = $scope.resultadosPlenoRenovado[i];

                if(resultadoAux != resultado){
                    var cantidadAux = partidos[resultadoAux] || 0;

                    if(Number(cantidadAux) > Number(cantidad)){
                        res = false;
                        break;
                    }else if(Number(cantidadAux) == Number(cantidad)){
                        repetidos++;
                    }
                }
            }
        }

        if(repetidos == 0){
            res = false;
        }

        return res;
    };

    $scope.resultadoPlenoMenosFrecuente = function(partidos, resultado, cantidad){
        var res = false;

        cantidad = cantidad || 0;

        if(typeof(resultado) != 'undefined' && typeof(cantidad) != 'undefined'){

            res = !$scope.resultadoPlenoMasFrecuenteEnSolitario(partidos, resultado, cantidad) &&
                  !$scope.resultadoPlenoMasFrecuenteEmpatado(partidos, resultado, cantidad);
        }

        return res;
    };

    $scope.sumaDePlenosRenovados = function(){
        var res = 0;

        if(!$scope.jsonVacio($scope.plenosRenovados)){
            // Se ha puesto este resultado por poner uno. Sólo hace falta saber si tiene datos.

            for(var i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var cantidad = Number($scope.plenosRenovados[$scope.resultadosPlenoRenovado[i]]) || 0;
                res = res + cantidad;
            }
        }

        return res;
    };

    $scope.sumaDePlenosRenovadosComoLocal = function(){
        var res = 0;

        if(!$scope.jsonVacio($scope.plenosRenovadosLocal)){
            // Se ha puesto este resultado por poner uno. Sólo hace falta saber si tiene datos.

            for(var i=0; i<$scope.resultadosPlenoRenovado.length; i++){
                var cantidad = Number($scope.plenosRenovadosLocal[$scope.resultadosPlenoRenovado[i]]) || 0;
                res = res + cantidad;
            }
        }

        return res;
    };

    $scope.sumaDePlenosRenovadosComoVisitante = function(){
        var res = 0;

        if(!$scope.jsonVacio($scope.plenosRenovadosVisitante)){
            // Se ha puesto este resultado por poner uno. Sólo hace falta saber si tiene datos.

            for(var i=0; i<$scope.resultadosPlenoRenovado.length; i++){

                var cantidad = Number($scope.plenosRenovadosVisitante[$scope.resultadosPlenoRenovado[i]]) || 0;
                res = res + cantidad;
            }
        }

        return res;

    };

    $scope.jsonVacio = function(json){
        var res = true;

        for(var prop in json) {
            if(json.hasOwnProperty(prop)){
                res = false;
                break;
            }
        }

        return res;
    };


    $scope.activarPestana = function(numero){
        if(numero == 1){
            $scope.primeraPestana = true;
            $scope.segundaPestana = false;
        }else{
            $scope.primeraPestana = false;
            $scope.segundaPestana = true;

        }
    };

    $scope.consultarEstandar = function(){
        $scope.limpiarTablasEstandar();
        $scope.consultando = true;

        quiniela.getHistoricalCombinations()
            .then(function(data){
                $scope.cargarTablaCombinaciones(data);

                $scope.mostrarCombinacionesSucedidas = true;

                $scope.consultando = false;
            })
            .catch(function(err){
                console.log(err);
            });
    };

    $scope.cargarTablaCombinaciones = function(datos){
        $scope.resultadosSucedidos = datos;
    };

    $scope.limpiarTablasEstandar = function(){
        $scope.mostrarCombinacionesSucedidas = false;
    };

    quiniela.getAllTeams()
        .then(function(data){
            $scope.equipos = data;
        })
        .catch(function(err){
            console.log(err);
        });

    quiniela.getAllCompetitions()
        .then(function(data){
            $scope.competiciones = data;
        })
        .catch(function(err){
            console.log(err);
        });

    quiniela.getAllSeasons()
        .then(function(data){
            $scope.temporadas = data;
        })
        .catch(function(err){
            console.log(err);
        });
};