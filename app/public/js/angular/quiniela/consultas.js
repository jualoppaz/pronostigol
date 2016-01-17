var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http, $filter) {

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

    /*
    $scope.temporadas = [
        {
            name: 'Histórico',
            value: 'Histórico'
        },
        {
            name: '2013-2014',
            value: '2013-2014'
        },{
            name: '2014-2015',
            value: '2014-2015'
        }
    ];
    */

    /*
    $scope.competiciones = [
        {
            name: 'Todas',
            value: 'Todas'
        },{
            name: '2ª División B',
            value: '2ª División B'
        },{
            name: 'Amistoso',
            value: 'Amistoso'
        },{
            name: 'Bundesliga',
            value: 'Bundesliga'
        },{
            name: 'Calcio',
            value: 'Calcio'
        },{
            name: 'Champions League',
            value: 'Champions League'
        },{
            name: 'Clasificación Eurocopa 2016',
            value: 'Clasificación Eurocopa 2016'
        },{
            name: 'Copa del Rey',
            value: 'Copa del Rey'
        },{
            name: 'Europa League',
            value: 'Europa League'
        },{
            name: 'Liga Adelante',
            value: 'Liga Adelante'
        },{
            name: 'Liga BBVA',
            value: 'Liga BBVA'
        },{
            name: 'Ligue 1',
            value: 'Ligue 1'
        },{
            name: 'Premier League',
            value: 'Premier League'
        }
    ];
    */

    /*
    $scope.equipos = [
        {name: 'Zaragoza', value: 'Zaragoza'},{name: 'Numancia', value: 'Numancia'},
        {name: 'Mallorca', value: 'Mallorca'},{name: 'Tenerife', value: 'Tenerife'},
        {name: 'Lugo', value: 'Lugo'},{name: 'Alcorcón', value: 'Alcorcón'},
        {name: 'Sabadell', value: 'Sabadell'},{name: 'Racing', value: 'Racing'},
        {name: 'Éibar', value: 'Éibar'},{name: 'Celta', value: 'Celta'},
        {name: 'Levante', value: 'Levante'},{name: 'Villarreal', value: 'Villarreal'},
        {name: 'Córdoba', value: 'Córdoba'},{name: 'Elche', value: 'Elche'},
        {name: 'Real Sociedad', value: 'Real Sociedad'},{name: 'Deportivo', value: 'Deportivo'},
        {name: 'Málaga', value: 'Málaga'},{name: 'Manchester City', value: 'Manchester City'},
        {name: 'Bayern de Munich', value: 'Bayern de Munich'},{name: 'Valencia', value: 'Valencia'},
        {name: 'Almería', value: 'Almería'},{name: 'Atlético de Madrid', value: 'Atlético de Madrid'},
        {name: 'Athletic de Bilbao', value: 'Athletic de Bilbao'},{name: 'Betis', value: 'Betis'},
        {name: 'Sevilla', value: 'Sevilla'},{name: 'Barcelona', value: 'Barcelona'},
        {name: 'Coruxo', value: 'Coruxo'},{name: 'Getafe', value: 'Getafe'},
        {name: 'Rayo Vallecano', value: 'Rayo Vallecano'},{name: 'Real Madrid',value: 'Real Madrid'},
        {name: 'Espanyol', value: 'Espanyol'},{name: 'Albacete', value:'Albacete'},
        {name: 'Osasuna', value: 'Osasuna'},{name: 'Girona', value: 'Girona'},
        {name: 'Recreativo', value: 'Recreativo'},{name: 'Valladolid', value: 'Valladolid'},
        {name: 'Las Palmas', value: 'Las Palmas'}, {name: 'PSG', value: 'PSG'},
        {name: 'Chelsea', value: 'Chelsea'},{ name: 'Shakhtar Donetsk', value: 'Shakhtar Donetsk'},
        {name: 'Basilea', value: 'Basilea'},{ name: 'Oporto', value: 'Oporto'},
        {name: 'Young Boys', value: 'Young Boys'}, {name: 'Everton', value: 'Everton'},
        {name: 'Torino', value: 'Torino'}, {name:'Wolfsburgo', value: 'Wolfsburgo'},
        {name: 'Sporting de Lisboa', value: 'Sporting de Lisboa'}, {name: 'Trabzonspor', value: 'Trabzonspor'},
        {name: 'Nápoles', value: 'Nápoles'}, {name: 'Roma', value:'Roma'}, {name: 'Feyenoord', value: 'Feyenoord'},
        {name: 'PSV', value: 'PSV'}, {name: 'Zenit', value: 'Zenit'}, {name: 'Liverpool', value: 'Liverpool'},
        {name: 'Besiktas', value: 'Besiktas'}, {name:'Tottenham', value:'Tottenham'},
        {name: 'Fiorentina', value: 'Fiorentina'}, {name: 'Celtic', value: 'Celtic'},
        {name: 'Inter de Milán', value: 'Inter de Milán'}, {name:'Salzburgo', value: 'Salzburgo'},
        {name: 'Borussia Dortmund', value: 'Borussia Dortmund'}, {name: 'Borussia Monchengladbach', value: 'Borussia Monchengladbach'},
        {name: 'Schalke', value: 'Schalke'}, {name: 'Apoel de Nicosia', value: 'Apoel de Nicosia'}

    ];
    */

    $scope.sumaDeVictoriasLocales = function(){
        var suma = 0;
        for(i=0;i<$scope.filas.length;i++){
            suma = suma + $scope.filas[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpates = function(){
        var suma = 0;
        for(i=0;i<$scope.filas.length;i++){
            suma = suma + $scope.filas[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantes = function(){
        var suma = 0;
        for(i=0;i<$scope.filas.length;i++){
            suma = suma + $scope.filas[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoLocal = function(){
        var suma = 0;
        for(i=0;i<$scope.filasLocal.length;i++){
            suma = suma + $scope.filasLocal[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoLocal = function(){
        var suma = 0;
        for(i=0;i<$scope.filasLocal.length;i++){
            suma = suma + $scope.filasLocal[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoLocal = function(){
        var suma = 0;
        for(i=0;i<$scope.filasLocal.length;i++){
            suma = suma + $scope.filasLocal[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoVisitante = function(){
        var suma = 0;
        for(i=0;i<$scope.filasVisitante.length;i++){
            suma = suma + $scope.filasVisitante[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoVisitante = function(){
        var suma = 0;
        for(i=0;i<$scope.filasVisitante.length;i++){
            suma = suma + $scope.filasVisitante[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoVisitante = function(){
        var suma = 0;
        for(i=0;i<$scope.filasVisitante.length;i++){
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

            for(i=1;i<=15;i++){

                var hayDatos = false;

                for(f=0;f<$scope.filasAux.length;f++){

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

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

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

            for(i=1;i<=15;i++){

                var hayDatos = false;

                for(f=0;f<$scope.filasAux.length;f++){

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

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

                var key = $scope.resultadosPlenoRenovado[i];
                if($scope.plenosRenovadosLocal[key] == null){
                    $scope.plenosRenovadosLocal[key] = 0;
                }
            }

            $scope.mostrarPlenoRenovadoLocalYVisitante = true;
        }
    };

    $scope.cargarTablaVisitante = function(data){

        /*
        Este era el fallo que me hizo perder una tarde. Estaba borrando la tabla como local justo
        despues de haberla consultado.
        */

        $scope.plenosRenovadosVisitante = data.plenosRenovados;

        $scope.filasVisitante = data.filas;

        if($scope.filasVisitante.length < 15){

            $scope.filasAux = $scope.filasVisitante;

            for(i=1;i<=15;i++){

                var hayDatos = false;

                for(f=0;f<$scope.filasAux.length;f++){

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

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

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

        /*
        var temporada = angular.element("#temporadaSeleccionada").val();
        var competicion = angular.element("#competicionSeleccionada").val();
        var opcionBusqueda = $scope.opcionBusqueda;
        var equipo = angular.element("#equipoSeleccionado").val();
        var equipoLocal = angular.element("#equipoLocalSeleccionadoPC").val() || angular.element("#equipoLocalSeleccionadoMovil").val();
        var equipoVisitante = angular.element("#equipoVisitanteSeleccionadoPC").val() || angular.element("#equipoVisitanteSeleccionado").val();

        */

        console.log("Competicion: " + competicion);

        console.log("Temporada: " + temporada);

        console.log("Opcion busqueda: " + opcionBusqueda);

        if(temporada == 'Histórico' || temporada == null || temporada == ""){

            if(competicion == 'Todas' || competicion == null || competicion == ""){
                if(opcionBusqueda == "general"){
                    console.log("/api/quiniela/historical");
                    $http.get('/api/quiniela/historical')
                        .success(function(data){
                            $scope.cargarTabla(data);

                            $scope.mostrar = true;

                            $scope.consultando = false;
                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;

                            $scope.consultando = false;

                        });

                }else if(opcionBusqueda == "equipo"){
                    if(equipo == "" || equipo == null){
                        alert("Debe introducir un equipo.");
                        $scope.consultando = false;
                    }else{ // Se ha introducido un equipo
                        console.log("/api/quiniela/historical/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/localTeam/' + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);

                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;
                            });

                        console.log("/api/quiniela/historical/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/visitorTeam/' + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);

                                $scope.mostrarLocalYVisitante = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
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
                            console.log("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante);
                            $http.get("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                                .success(function(data){
                                    $scope.cargarTabla(data);

                                    $scope.mostrar = true;
                                    $scope.consultando = false;

                                })
                                .error(function(data){
                                    console.log(data);
                                    $scope.mostrar = false;
                                    $scope.consultando = false;

                                });
                        }
                    }

                    /*
                    if(equipoLocal != null && equipoVisitante != null){ // Se ha indicado el partido correctamente
                        console.log("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante);
                        $http.get("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);

                                $scope.mostrar = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;
                                $scope.consultando = false;

                            });
                    }
                    */
                }

            }else{
                if(opcionBusqueda == "general"){
                    console.log("/api/quiniela/historical/competition/" + competicion);
                    $http.get('/api/quiniela/historical/competition/' + competicion)
                        .success(function(data){
                            $scope.cargarTabla(data);

                            $scope.mostrar = true;
                            $scope.consultando = false;

                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;
                            $scope.consultando = false;

                        })
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                        $scope.consultando = false;
                    }else{
                        console.log("/api/quiniela/historical/competition/" + competicion + "/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/competition/' + competicion + "/localTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);

                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;

                            });

                        console.log("/api/quiniela/historical/competition/" + competicion + "/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/competition/' + competicion + "/visitorTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        console.log('/api/quiniela/historical/competition/' + competicion + "/footballMatch/localTeam/" + equipoLocal  + "/visitorTeam/" + equipoVisitante);
                        $http.get('/api/quiniela/historical/competition/' + competicion + "/footballMatch/localTeam/" + equipoLocal  + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;
                                $scope.consultando = false;

                            });
                    }
                }
            }
        }else{
            if(competicion == 'Todas' || competicion == null || competicion == ""){
                if(opcionBusqueda == "general"){
                    console.log('/api/quiniela/historical/season/' + temporada);
                    $http.get('/api/quiniela/historical/season/' + temporada)
                        .success(function(data){
                            $scope.cargarTabla(data);
                            $scope.mostrar = true;

                            $scope.consultando = false;

                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;

                            $scope.consultando = false;

                        });

                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                    }else{
                        console.log('/api/quiniela/historical/season/' + temporada + "/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/localTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });

                        console.log('/api/quiniela/historical/season/' + temporada + "/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/visitorTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        console.log('/api/quiniela/historical/season/' + temporada + "/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;

                                $scope.consultando = false;

                            });
                    }
                }
            }else{ // Se ha seleccionado una competicion
                if(opcionBusqueda == "general"){
                    console.log('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion);
                    $http.get('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion)
                        .success(function(data){
                            $scope.cargarTabla(data);
                            $scope.mostrar = true;

                            $scope.consultando = false;

                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;

                            $scope.consultando = false;

                        });
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                    }else{ // Se ha introducido un equipo
                        console.log('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/localTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });

                        console.log('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/visitorTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        console.log("/api/quiniela/historical/season/" + temporada + "/competition/" + competicion + "/footballMatch/" +
                            "localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                        $http.get("/api/quiniela/historical/season/" + temporada + "/competition/" + competicion + "/footballMatch/" +
                        "localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
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

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

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

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

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

            for(i=0;i<$scope.resultadosPlenoRenovado.length; i++){
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

            for(i=0;i<$scope.resultadosPlenoRenovado.length; i++){

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

            for(i=0;i<$scope.resultadosPlenoRenovado.length; i++){

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


        $http.get('/api/quiniela/historical/combinaciones')
            .success(function(data){
                $scope.cargarTablaCombinaciones(data);

                $scope.mostrarCombinacionesSucedidas = true;

                $scope.consultando = false;
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.cargarTablaCombinaciones = function(datos){
        $scope.resultadosSucedidos = datos;
    };

    $scope.limpiarTablasEstandar = function(){
        $scope.mostrarCombinacionesSucedidas = false;
    };

    $http.get('/api/quiniela/equipos')
        .success(function(data){
            $scope.equipos = data;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/api/quiniela/competiciones')
        .success(function(data){
            $scope.competiciones = data;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/api/quiniela/temporadas')
        .success(function(data){
            $scope.temporadas = data;
        })
        .error(function(data){
            console.log(data);
        });

});




