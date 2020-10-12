var app = angular.module('dashboard');

app.controller('AnalizadorController', Controller);

Controller.$inject = ['$scope', '$q', '$window', 'quiniela', '$sce'];

function Controller($scope, $q, $window, quiniela, $sce) {

    quiniela
        .getAllTeams()
        .then(function (data) {
            $scope.equipos = data;
        })
        .catch(function (err) {
            console.log(err);
        });

    quiniela
        .getAllCompetitions()
        .then(function (data) {
            $scope.competiciones = data;
        })
        .catch(function (err) {
            console.log(err);
        });

    $scope.sumaDeVictoriasLocalesComoLocal = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasLocal.length; i++) {
            suma = suma + $scope.filasLocal[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoLocal = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasLocal.length; i++) {
            suma = suma + $scope.filasLocal[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoLocal = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasLocal.length; i++) {
            suma = suma + $scope.filasLocal[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoLocalEnCompeticion = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasLocalYCompeticion.length; i++) {
            suma = suma + $scope.filasLocalYCompeticion[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoLocalEnCompeticion = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasLocalYCompeticion.length; i++) {
            suma = suma + $scope.filasLocalYCompeticion[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoLocalEnCompeticion = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasLocalYCompeticion.length; i++) {
            suma = suma + $scope.filasLocalYCompeticion[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoVisitante = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasVisitante.length; i++) {
            suma = suma + $scope.filasVisitante[i].victoriasLocales || 0;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoVisitante = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasVisitante.length; i++) {
            suma = suma + $scope.filasVisitante[i].empates || 0;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoVisitante = function () {
        var suma = 0;
        for (var i = 0; i < $scope.filasVisitante.length; i++) {
            suma = suma + $scope.filasVisitante[i].victoriasVisitantes || 0;
        }
        return suma;
    };

    $scope.limpiarInformes = function () {

    };

    $scope.validateForm = function (form) {
        var equipoLocal = form.equipoLocal;
        var equipoVisitante = form.equipoVisitante;
        var fila = parseInt(form.fila);
        var competicion = form.competicion;

        if (equipoLocal == "" || equipoLocal == null) return 'Debes introducir el equipo local';
        if (equipoVisitante == "" || equipoVisitante == null) return 'Debes introducir el equipo visitante';
        if (isNaN(fila) || fila == "" || fila == null || fila < 0 || fila > 15) return 'Debes introducir una fila válida';
        if (competicion == "" || competicion == null) return 'Debes introducir la competición';
        return false;
    };

    $scope.analizar = function () {
        $scope.consultando = true;
        $scope.reset();

        var competicion = $scope.form.competicion;
        var equipoLocal = $scope.form.equipoLocal;
        var equipoVisitante = $scope.form.equipoVisitante;

        var validationResult = $scope.validateForm($scope.form);

        if (validationResult) {
            alert(validationResult);
            $scope.consultando = false;
            return;
        }

        $q.all([
            quiniela
                .getHistorical({
                    local_team: equipoLocal,
                }),
            quiniela
                .getHistorical({
                    local_team: equipoLocal,
                    competition: competicion,
                })
        ])
            .then(function (data) {
                $scope.realizarAnalisis(data);
                $scope.mostrar = true;
            })
            .catch(function (err) {
                $scope.mostrar = false;
            })
            .finally(function () {
                $scope.consultando = false;
            });
    };

    $scope.realizarAnalisis = function (data) {
        $scope.filasLocal = data[0].filas;
        $scope.filasLocalYCompeticion = data[1].filas;

        // Equipo local
        $scope.realizarAnalisisEquipoLocal();
        $scope.realizarAnalisisEquipoLocalYFila();

        $scope.realizarAnalisisEquipoLocalYCompeticion();
        $scope.realizarAnalisisEquipoLocalCompeticionYFila();
    };

    $scope.realizarAnalisisEquipoLocal = function () {
        var message = quiniela.ANALYZER_MESSAGES.LOCAL.HISTORICAL;

        var sumaDeVictoriasLocalesComoLocal = $scope.sumaDeVictoriasLocalesComoLocal();
        var sumaDeEmpatesComoLocal = $scope.sumaDeEmpatesComoLocal();
        var sumaDeVictoriasVisitantesComoLocal = $scope.sumaDeVictoriasVisitantesComoLocal();

        var totalPartidosComoLocal =
            sumaDeVictoriasLocalesComoLocal + sumaDeEmpatesComoLocal +
            sumaDeVictoriasVisitantesComoLocal;

        var porcentajeDeVictoriasLocalesComoLocal = sumaDeVictoriasLocalesComoLocal * 100 / totalPartidosComoLocal;
        var porcentajeDeEmpatesComoLocal = sumaDeEmpatesComoLocal * 100 / totalPartidosComoLocal;
        var porcentajeDeVictoriasVisitantesComoLocal = sumaDeVictoriasVisitantesComoLocal * 100 / totalPartidosComoLocal;

        porcentajeDeVictoriasLocalesComoLocal = Math.round(porcentajeDeVictoriasLocalesComoLocal * 100) / 100;
        porcentajeDeEmpatesComoLocal = Math.round(porcentajeDeEmpatesComoLocal * 100) / 100;
        porcentajeDeVictoriasVisitantesComoLocal = Math.round(porcentajeDeVictoriasVisitantesComoLocal * 100) / 100;

        message = $scope.getCustomMessage(message, {
            "{localTeam}": $scope.form.equipoLocal,
            '{numWins}': sumaDeVictoriasLocalesComoLocal,
            '{numDraws}': sumaDeEmpatesComoLocal,
            '{numLoses}': sumaDeVictoriasVisitantesComoLocal,
            '{perWins}': porcentajeDeVictoriasLocalesComoLocal,
            '{perDraws}': porcentajeDeEmpatesComoLocal,
            '{perLoses}': porcentajeDeVictoriasVisitantesComoLocal,
        });

        $scope.localTeamMessages.push(message);
    }

    $scope.realizarAnalisisEquipoLocalYFila = function () {
        var message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.NO_DATA;

        var fila = $scope.filasLocal.find(function (row) {
            return row.fila === parseInt($scope.form.fila);
        }) || {};

        var sumaDeVictoriasLocalesComoLocalEnFila = fila.victoriasLocales;
        var sumaDeEmpatesComoLocalEnFila = fila.empates;
        var sumaDeVictoriasVisitantesComoLocalEnFila = fila.victoriasVisitantes;

        var totalPartidosComoLocalEnFila =
            sumaDeVictoriasLocalesComoLocalEnFila + sumaDeEmpatesComoLocalEnFila +
            sumaDeVictoriasVisitantesComoLocalEnFila;

        var porcentajeDeVictoriasLocalesComoLocalEnFila = sumaDeVictoriasLocalesComoLocalEnFila * 100 / totalPartidosComoLocalEnFila;
        var porcentajeDeEmpatesComoLocalEnFila = sumaDeEmpatesComoLocalEnFila * 100 / totalPartidosComoLocalEnFila;
        var porcentajeDeVictoriasVisitantesComoLocalEnFila = sumaDeVictoriasVisitantesComoLocalEnFila * 100 / totalPartidosComoLocalEnFila;

        porcentajeDeVictoriasLocalesComoLocalEnFila = Math.round(porcentajeDeVictoriasLocalesComoLocalEnFila * 100) / 100;
        porcentajeDeEmpatesComoLocalEnFila = Math.round(porcentajeDeEmpatesComoLocalEnFila * 100) / 100;
        porcentajeDeVictoriasVisitantesComoLocalEnFila = Math.round(porcentajeDeVictoriasVisitantesComoLocalEnFila * 100) / 100;

        if (!fila.victoriasLocales && !fila.empates && !fila.victoriasVisitantes) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.ONLY_WINS;

        if (fila.victoriasLocales > 0 && fila.empates === 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.ONLY_DRAWS;

        if (fila.victoriasLocales === 0 && fila.empates > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.ONLY_LOSES;

        if (fila.victoriasLocales === 0 && fila.empates === 0 && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_AND_DRAWS_BUT_NO_LOSES.MORE_WINS_THAN_DRAWS;

        if (fila.victoriasLocales > fila.empates && fila.empates > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_AND_DRAWS_BUT_NO_LOSES.SAME;

        if (fila.victoriasLocales === fila.empates && fila.empates > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_AND_DRAWS_BUT_NO_LOSES.MORE_DRAWS_THAN_WINS;

        if (fila.victoriasLocales > 0 && fila.victoriasLocales < fila.empates && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_AND_LOSES_BUT_NO_DRAWS.MORE_WINS_THAN_LOSES;

        if (fila.victoriasLocales > fila.victoriasVisitantes && fila.victoriasVisitantes > 0 && fila.empates === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_AND_LOSES_BUT_NO_DRAWS.SAME;

        if (fila.victoriasLocales === fila.victoriasVisitantes && fila.victoriasVisitantes > 0 && fila.empates === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_AND_LOSES_BUT_NO_DRAWS.MORE_LOSES_THAN_WINS;

        if (fila.victoriasLocales < fila.victoriasVisitantes && fila.victoriasLocales > 0 && fila.empates === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.DRAWS_AND_LOSES_BUT_NO_WINS.MORE_DRAWS_THAN_LOSES;

        if (fila.victoriasLocales === 0 && fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.DRAWS_AND_LOSES_BUT_NO_WINS.SAME;

        if (fila.victoriasLocales === 0 && fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.DRAWS_AND_LOSES_BUT_NO_WINS.MORE_LOSES_THAN_DRAWS;

        if (fila.victoriasLocales === 0 && fila.empates < fila.victoriasVisitantes && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_WINS.MORE_DRAWS;

        if (fila.victoriasLocales > fila.empates && fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_WINS.SAME;

        if (fila.victoriasLocales > fila.empates && fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_WINS.MORE_LOSES;

        if (fila.victoriasLocales > fila.victoriasVisitantes && fila.victoriasVisitantes > fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_DRAWS.MORE_WINS;

        if (fila.empates > fila.victoriasLocales && fila.victoriasLocales > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_DRAWS.SAME;

        if (fila.empates > fila.victoriasLocales && fila.victoriasLocales === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_DRAWS.MORE_LOSES;

        if (fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_LOSES.MORE_WINS;

        if (fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_LOSES.SAME;

        if (fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales === fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.MORE_LOSES.MORE_DRAWS;

        if (fila.victoriasVisitantes > fila.empates && fila.empates > fila.victoriasLocales && fila.victoriasLocales > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.SAME_WINS_AND_DRAWS;

        if (fila.victoriasLocales === fila.empates && fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.SAME_WINS_AND_LOSES;

        if (fila.victoriasLocales === fila.victoriasVisitantes && fila.victoriasVisitantes > fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.SAME_DRAWS_AND_LOSES;

        if (fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.ROW.WINS_DRAWS_AND_LOSES.SAME;

        if (fila.victoriasLocales === fila.empates && fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnFila,
            });

            $scope.localTeamMessages.push(message);
        }
    }

    $scope.realizarAnalisisEquipoLocalYCompeticion = function () {
        var message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.HISTORICAL;

        var sumaDeVictoriasLocalesComoLocalEnCompeticion = $scope.sumaDeVictoriasLocalesComoLocalEnCompeticion();
        var sumaDeEmpatesComoLocalEnCompeticion = $scope.sumaDeEmpatesComoLocalEnCompeticion();
        var sumaDeVictoriasVisitantesComoLocalEnCompeticion = $scope.sumaDeVictoriasVisitantesComoLocalEnCompeticion();

        var totalPartidosComoLocalEnCompeticion =
            sumaDeVictoriasLocalesComoLocalEnCompeticion + sumaDeEmpatesComoLocalEnCompeticion +
            sumaDeVictoriasVisitantesComoLocalEnCompeticion;

        var porcentajeDeVictoriasLocalesComoLocalEnCompeticion = sumaDeVictoriasLocalesComoLocalEnCompeticion * 100 / totalPartidosComoLocalEnCompeticion;
        var porcentajeDeEmpatesComoLocalEnCompeticion = sumaDeEmpatesComoLocalEnCompeticion * 100 / totalPartidosComoLocalEnCompeticion;
        var porcentajeDeVictoriasVisitantesComoLocalEnCompeticion = sumaDeVictoriasVisitantesComoLocalEnCompeticion * 100 / totalPartidosComoLocalEnCompeticion;

        porcentajeDeVictoriasLocalesComoLocalEnCompeticion = Math.round(porcentajeDeVictoriasLocalesComoLocalEnCompeticion * 100) / 100;
        porcentajeDeEmpatesComoLocalEnCompeticion = Math.round(porcentajeDeEmpatesComoLocalEnCompeticion * 100) / 100;
        porcentajeDeVictoriasVisitantesComoLocalEnCompeticion = Math.round(porcentajeDeVictoriasVisitantesComoLocalEnCompeticion * 100) / 100;

        message = $scope.getCustomMessage(message, {
            "{localTeam}": $scope.form.equipoLocal,
            "{competition}": $scope.form.competicion,
            '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticion,
            '{numDraws}': sumaDeEmpatesComoLocalEnCompeticion,
            '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticion,
            '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticion,
            '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticion,
            '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticion,
        });

        $scope.localTeamMessages.push(message);
    }

    $scope.realizarAnalisisEquipoLocalCompeticionYFila = function () {
        var message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.NO_DATA;

        var fila = $scope.filasLocalYCompeticion.find(function (row) {
            return row.fila === parseInt($scope.form.fila);
        }) || {};

        var sumaDeVictoriasLocalesComoLocalEnCompeticionYFila = fila.victoriasLocales;
        var sumaDeEmpatesComoLocalEnCompeticionYFila = fila.empates;
        var sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila = fila.victoriasVisitantes;

        var totalPartidosComoLocalEnCompeticionYFila =
            sumaDeVictoriasLocalesComoLocalEnCompeticionYFila + sumaDeEmpatesComoLocalEnCompeticionYFila +
            sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila;

        var porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila = sumaDeVictoriasLocalesComoLocalEnCompeticionYFila * 100 / totalPartidosComoLocalEnCompeticionYFila;
        var porcentajeDeEmpatesComoLocalEnCompeticionYFila = sumaDeEmpatesComoLocalEnCompeticionYFila * 100 / totalPartidosComoLocalEnCompeticionYFila;
        var porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila = sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila * 100 / totalPartidosComoLocalEnCompeticionYFila;

        porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila = Math.round(porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila * 100) / 100;
        porcentajeDeEmpatesComoLocalEnCompeticionYFila = Math.round(porcentajeDeEmpatesComoLocalEnCompeticionYFila * 100) / 100;
        porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila = Math.round(porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila * 100) / 100;

        if (!fila.victoriasLocales && !fila.empates && !fila.victoriasVisitantes) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.ONLY_WINS;

        if (fila.victoriasLocales > 0 && fila.empates === 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.ONLY_DRAWS;

        if (fila.victoriasLocales === 0 && fila.empates > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.ONLY_LOSES;

        if (fila.victoriasLocales === 0 && fila.empates === 0 && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_AND_DRAWS_BUT_NO_LOSES.MORE_WINS_THAN_DRAWS;

        if (fila.victoriasLocales > fila.empates && fila.empates > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_AND_DRAWS_BUT_NO_LOSES.SAME;

        if (fila.victoriasLocales === fila.empates && fila.empates > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_AND_DRAWS_BUT_NO_LOSES.MORE_DRAWS_THAN_WINS;

        if (fila.empates > fila.victoriasLocales && fila.victoriasLocales > 0 && fila.victoriasVisitantes === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_AND_LOSES_BUT_NO_DRAWS.MORE_WINS_THAN_LOSES;

        if (fila.victoriasLocales > fila.victoriasVisitantes && fila.victoriasVisitantes > 0 && fila.empates === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_AND_LOSES_BUT_NO_DRAWS.SAME;

        if (fila.victoriasLocales === fila.victoriasVisitantes && fila.victoriasVisitantes > 0 && fila.empates === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_AND_LOSES_BUT_NO_DRAWS.MORE_LOSES_THAN_WINS;

        if (fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > 0 && fila.empates === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.DRAWS_AND_LOSES_BUT_NO_WINS.MORE_DRAWS_THAN_LOSES;

        if (fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > 0 && fila.victoriasLocales === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.DRAWS_AND_LOSES_BUT_NO_WINS.SAME;

        if (fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > 0 && fila.victoriasLocales === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.DRAWS_AND_LOSES_BUT_NO_WINS.MORE_LOSES_THAN_DRAWS;

        if (fila.victoriasVisitantes > fila.empates && fila.empates > 0 && fila.victoriasLocales === 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_WINS.MORE_DRAWS;

        if (fila.victoriasLocales > fila.empates && fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_WINS.SAME;

        if (fila.victoriasLocales > fila.empates && fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_WINS.MORE_LOSES;

        if (fila.victoriasLocales > fila.victoriasVisitantes && fila.victoriasVisitantes > fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_DRAWS.MORE_WINS;

        if (fila.empates > fila.victoriasLocales && fila.victoriasLocales > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_DRAWS.SAME;

        if (fila.empates > fila.victoriasLocales && fila.victoriasLocales === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_DRAWS.MORE_LOSES;

        if (fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_LOSES.MORE_WINS;

        if (fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_LOSES.SAME;

        if (fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales === fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.MORE_LOSES.MORE_DRAWS;

        if (fila.victoriasVisitantes > fila.empates && fila.empates > fila.victoriasLocales && fila.victoriasLocales > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.SAME_WINS_AND_DRAWS;

        if (fila.victoriasLocales === fila.empates && fila.empates > fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.SAME_WINS_AND_LOSES;

        if (fila.victoriasLocales === fila.victoriasVisitantes && fila.victoriasVisitantes > fila.empates && fila.empates > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.SAME_DRAWS_AND_LOSES;

        if (fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > fila.victoriasLocales && fila.victoriasLocales > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }

        message = quiniela.ANALYZER_MESSAGES.LOCAL.COMPETITION.ROW.WINS_DRAWS_AND_LOSES.SAME;

        if (fila.victoriasLocales === fila.empates && fila.empates === fila.victoriasVisitantes && fila.victoriasVisitantes > 0) {
            message = $scope.getCustomMessage(message, {
                "{localTeam}": $scope.form.equipoLocal,
                "{competition}": $scope.form.competicion,
                '{row}': $scope.form.fila,
                '{numWins}': sumaDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{numDraws}': sumaDeEmpatesComoLocalEnCompeticionYFila,
                '{numLoses}': sumaDeVictoriasVisitantesComoLocalEnCompeticionYFila,
                '{perWins}': porcentajeDeVictoriasLocalesComoLocalEnCompeticionYFila,
                '{perDraws}': porcentajeDeEmpatesComoLocalEnCompeticionYFila,
                '{perLoses}': porcentajeDeVictoriasVisitantesComoLocalEnCompeticionYFila,
            });

            $scope.localTeamMessages.push(message);
        }
    };

    $scope.getCustomMessage = function (message, translations) {
        var res = angular.copy(message);

        angular.forEach(translations, function (value, key) {
            res = res.replace(key, value);
        });

        return res;
    }

    $scope.redirigir = function () {
        $window.location.href = "/admin/quiniela/equipos";
    };

    $scope.reset = function () {
        $scope.localTeamMessages = [];
    };

    $scope.init = function () {
        $scope.form = {
            equipoLocal: 'null',
            equipoVisitante: null,
            fila: null,
        };

        // TODO: ELIMINAR
        $scope.form = {
            equipoLocal: 'Celta',
            equipoVisitante: 'Betis',
            fila: 6,
            competicion: 'Liga Española'
        };

        $scope.reset();
    };

    $scope.init();
}