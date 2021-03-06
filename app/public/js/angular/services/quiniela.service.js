(function () {
    "use strict";

    angular.module("quiniela", []).factory("quiniela", service);

    service.$inject = ["$http", "$q"];

    function service($http, $q) {
        var apiPrefix = "/api/quiniela";

        const ANALYZER_MESSAGES = {
            LOCAL: {
                HISTORICAL: 'El histórico del equipo <b>{localTeam}</b> como local en la quiniela cuenta con los siguientes datos: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                ROW: {
                    NO_DATA: 'No hay registros del equipo <b>{localTeam}</b> en la fila <b>{row}</b>.',
                    ONLY_WINS: 'Todos los partidos que ha disputado el equipo <b>{localTeam}</b> como local en la fila <b>{row}</b> han terminado en victoria local: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    ONLY_DRAWS: 'Todos los partidos que ha disputado el equipo <b>{localTeam}</b> como local en la fila <b>{row}</b> han terminado en empate: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    ONLY_LOSES: 'Todos los partidos que ha disputado el equipo <b>{localTeam}</b> como local en la fila <b>{row}</b> han terminado en victoria visitante: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    WINS_AND_DRAWS_BUT_NO_LOSES: {
                        MORE_WINS_THAN_DRAWS: 'El equipo <b>{localTeam}</b> no ha perdido en la fila <b>{row}</b> como local y ha ganado más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'El equipo <b>{localTeam}</b> no ha perdido en la fila <b>{row}</b> como local y ha ganado las mismas veces que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        MORE_DRAWS_THAN_WINS: 'El equipo <b>{localTeam}</b> no ha perdido en la fila <b>{row}</b> como local y ha empatado más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    },
                    WINS_AND_LOSES_BUT_NO_DRAWS: {
                        MORE_WINS_THAN_LOSES: 'El equipo <b>{localTeam}</b> no ha empatado en la fila <b>{row}</b> como local y ha ganado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'El equipo <b>{localTeam}</b> no ha empatado en la fila <b>{row}</b> como local y ha ganado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        MORE_LOSES_THAN_WINS: 'El equipo <b>{localTeam}</b> no ha empatado en la fila <b>{row}</b> como local y ha perdido más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    },
                    DRAWS_AND_LOSES_BUT_NO_WINS: {
                        MORE_DRAWS_THAN_LOSES: 'El equipo <b>{localTeam}</b> no ha ganado en la fila <b>{row}</b> como local y ha empatado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'El equipo <b>{localTeam}</b> no ha ganado en la fila <b>{row}</b> como local y ha empatado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        MORE_LOSES_THAN_DRAWS: 'El equipo <b>{localTeam}</b> no ha ganado en la fila <b>{row}</b> como local y ha perdido más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    },
                    WINS_DRAWS_AND_LOSES: {
                        MORE_WINS: {
                            MORE_DRAWS: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha ganado más de lo que ha empatado y ha empatado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha ganado más de lo que ha empatado y ha empatado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha ganado más de lo que ha perdido y ha perdido más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                        MORE_DRAWS: {
                            MORE_WINS: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha empatado más de lo que ha ganado y ha ganado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha empatado más de lo que ha ganado y ha ganado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha empatado más de lo que ha perdido y ha perdido más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                        MORE_LOSES: {
                            MORE_WINS: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha perdido más de lo que ha ganado y ha ganado más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha perdido más de lo que ha ganado y ha ganado lo mismo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_DRAWS: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha perdido más de lo que ha empatado y ha empatado más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                        SAME_WINS_AND_DRAWS: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha ganado lo mismo que ha empatado, siendo más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME_WINS_AND_LOSES: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha ganado lo mismo que ha perdido, siendo más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME_DRAWS_AND_LOSES: 'En la fila <b>{row}</b> el equipo <b>{localTeam}</b> como local ha empatado lo mismo que ha perdido, siendo más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'En la fila <b>{row}</b> hay máxima igualdad puesto que el número de victorias locales, empates y victorias visitantes es idéntico: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                    },
                },
                COMPETITION: {
                    HISTORICAL: 'En la competición <b>{competition}</b> los números del equipo <b>{localTeam}</b> como local son los siguientes: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    ROW: {
                        NO_DATA: 'No hay registros del equipo <b>{localTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b>.',
                        ONLY_WINS: 'Todos los partidos que ha disputado el equipo <b>{localTeam}</b> como local en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en victoria local: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        ONLY_DRAWS: 'Todos los partidos que ha disputado el equipo <b>{localTeam}</b> como local en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en empate: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        ONLY_LOSES: 'Todos los partidos que ha disputado el equipo <b>{localTeam}</b> como local en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en victoria visitante: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        WINS_AND_DRAWS_BUT_NO_LOSES: {
                            MORE_WINS_THAN_DRAWS: 'El equipo <b>{localTeam}</b> no ha perdido en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha ganado más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'El equipo <b>{localTeam}</b> no ha perdido en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha ganado las mismas veces que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_DRAWS_THAN_WINS: 'El equipo <b>{localTeam}</b> no ha perdido en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha empatado más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        },
                        WINS_AND_LOSES_BUT_NO_DRAWS: {
                            MORE_WINS_THAN_LOSES: 'El equipo <b>{localTeam}</b> no ha empatado en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha ganado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'El equipo <b>{localTeam}</b> no ha empatado en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha ganado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES_THAN_WINS: 'El equipo <b>{localTeam}</b> no ha empatado en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha perdido más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        },
                        DRAWS_AND_LOSES_BUT_NO_WINS: {
                            MORE_DRAWS_THAN_LOSES: 'El equipo <b>{localTeam}</b> no ha ganado en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha empatado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'El equipo <b>{localTeam}</b> no ha ganado en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha empatado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES_THAN_DRAWS: 'El equipo <b>{localTeam}</b> no ha ganado en la competición <b>{competition}</b> en la fila <b>{row}</b> como local y ha perdido más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        },
                        WINS_DRAWS_AND_LOSES: {
                            MORE_WINS: {
                                MORE_DRAWS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha ganado más de lo que ha empatado y ha empatado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha ganado más de lo que ha empatado y ha empatado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                MORE_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha ganado más de lo que ha perdido y ha perdido más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                            },
                            MORE_DRAWS: {
                                MORE_WINS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha empatado más de lo que ha ganado y ha ganado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha empatado más de lo que ha ganado y ha ganado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                MORE_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha empatado más de lo que ha perdido y ha perdido más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                            },
                            MORE_LOSES: {
                                MORE_WINS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha perdido más de lo que ha ganado y ha ganado más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha perdido más de lo que ha ganado y ha ganado lo mismo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                MORE_DRAWS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha perdido más de lo que ha empatado y ha empatado más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                            },
                            SAME_WINS_AND_DRAWS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha ganado lo mismo que ha empatado, siendo más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME_WINS_AND_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha ganado lo mismo que ha perdido, siendo más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME_DRAWS_AND_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{localTeam}</b> como local ha empatado lo mismo que ha perdido, siendo más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b> hay máxima igualdad puesto que el número de victorias locales, empates y victorias visitantes es idéntico: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                    }
                }
            },
            VISITOR: {
                HISTORICAL: 'El histórico del equipo <b>{visitorTeam}</b> como visitante en la quiniela cuenta con los siguientes datos: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                ROW: {
                    NO_DATA: 'No hay registros del equipo <b>{visitorTeam}</b> en la fila <b>{row}</b>.',
                    ONLY_WINS: 'Todos los partidos que ha disputado el equipo <b>{visitorTeam}</b> como visitante en la fila <b>{row}</b> han terminado en victoria visitante: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    ONLY_DRAWS: 'Todos los partidos que ha disputado el equipo <b>{visitorTeam}</b> como visitante en la fila <b>{row}</b> han terminado en empate: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    ONLY_LOSES: 'Todos los partidos que ha disputado el equipo <b>{visitorTeam}</b> como visitante en la fila <b>{row}</b> han terminado en victoria local: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    WINS_AND_DRAWS_BUT_NO_LOSES: {
                        MORE_WINS_THAN_DRAWS: 'El equipo <b>{visitorTeam}</b> no ha perdido en la fila <b>{row}</b> como visitante y ha ganado más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'El equipo <b>{visitorTeam}</b> no ha perdido en la fila <b>{row}</b> como visitante y ha ganado las mismas veces que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        MORE_DRAWS_THAN_WINS: 'El equipo <b>{visitorTeam}</b> no ha perdido en la fila <b>{row}</b> como visitante y ha empatado más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    },
                    WINS_AND_LOSES_BUT_NO_DRAWS: {
                        MORE_WINS_THAN_LOSES: 'El equipo <b>{visitorTeam}</b> no ha empatado en la fila <b>{row}</b> como visitante y ha ganado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'El equipo <b>{visitorTeam}</b> no ha empatado en la fila <b>{row}</b> como visitante y ha ganado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        MORE_LOSES_THAN_WINS: 'El equipo <b>{visitorTeam}</b> no ha empatado en la fila <b>{row}</b> como visitante y ha perdido más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    },
                    DRAWS_AND_LOSES_BUT_NO_WINS: {
                        MORE_DRAWS_THAN_LOSES: 'El equipo <b>{visitorTeam}</b> no ha ganado en la fila <b>{row}</b> como visitante y ha empatado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'El equipo <b>{visitorTeam}</b> no ha ganado en la fila <b>{row}</b> como visitante y ha empatado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        MORE_LOSES_THAN_DRAWS: 'El equipo <b>{visitorTeam}</b> no ha ganado en la fila <b>{row}</b> como visitante y ha perdido más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    },
                    WINS_DRAWS_AND_LOSES: {
                        MORE_WINS: {
                            MORE_DRAWS: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha ganado más de lo que ha empatado y ha empatado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha ganado más de lo que ha empatado y ha empatado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha ganado más de lo que ha perdido y ha perdido más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                        MORE_DRAWS: {
                            MORE_WINS: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha empatado más de lo que ha ganado y ha ganado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha empatado más de lo que ha ganado y ha ganado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha empatado más de lo que ha perdido y ha perdido más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                        MORE_LOSES: {
                            MORE_WINS: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha perdido más de lo que ha ganado y ha ganado más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha perdido más de lo que ha ganado y ha ganado lo mismo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_DRAWS: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha perdido más de lo que ha empatado y ha empatado más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                        SAME_WINS_AND_DRAWS: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha ganado lo mismo que ha empatado, siendo más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME_WINS_AND_LOSES: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha ganado lo mismo que ha perdido, siendo más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME_DRAWS_AND_LOSES: 'En la fila <b>{row}</b> el equipo <b>{visitorTeam}</b> como visitante ha empatado lo mismo que ha perdido, siendo más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        SAME: 'En la fila <b>{row}</b> hay máxima igualdad puesto que el número de victorias locales, empates y victorias visitantes es idéntico: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                    },
                },
                COMPETITION: {
                    HISTORICAL: 'En la competición <b>{competition}</b> los números del equipo <b>{visitorTeam}</b> como visitante son los siguientes: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                    ROW: {
                        NO_DATA: 'No hay registros del equipo <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b>.',
                        ONLY_WINS: 'Todos los partidos que ha disputado el equipo <b>{visitorTeam}</b> como visitante en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en victoria visitante: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        ONLY_DRAWS: 'Todos los partidos que ha disputado el equipo <b>{visitorTeam}</b> como visitante en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en empate: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        ONLY_LOSES: 'Todos los partidos que ha disputado el equipo <b>{visitorTeam}</b> como visitante en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en victoria local: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        WINS_AND_DRAWS_BUT_NO_LOSES: {
                            MORE_WINS_THAN_DRAWS: 'El equipo <b>{visitorTeam}</b> no ha perdido en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha ganado más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'El equipo <b>{visitorTeam}</b> no ha perdido en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha ganado las mismas veces que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_DRAWS_THAN_WINS: 'El equipo <b>{visitorTeam}</b> no ha perdido en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha empatado más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        },
                        WINS_AND_LOSES_BUT_NO_DRAWS: {
                            MORE_WINS_THAN_LOSES: 'El equipo <b>{visitorTeam}</b> no ha empatado en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha ganado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'El equipo <b>{visitorTeam}</b> no ha empatado en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha ganado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES_THAN_WINS: 'El equipo <b>{visitorTeam}</b> no ha empatado en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha perdido más veces de las que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        },
                        DRAWS_AND_LOSES_BUT_NO_WINS: {
                            MORE_DRAWS_THAN_LOSES: 'El equipo <b>{visitorTeam}</b> no ha ganado en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha empatado más veces de las que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'El equipo <b>{visitorTeam}</b> no ha ganado en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha empatado las mismas veces que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            MORE_LOSES_THAN_DRAWS: 'El equipo <b>{visitorTeam}</b> no ha ganado en la competición <b>{competition}</b> en la fila <b>{row}</b> como visitante y ha perdido más veces de las que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                        },
                        WINS_DRAWS_AND_LOSES: {
                            MORE_WINS: {
                                MORE_DRAWS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha ganado más de lo que ha empatado y ha empatado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha ganado más de lo que ha empatado y ha empatado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                MORE_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha ganado más de lo que ha perdido y ha perdido más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                            },
                            MORE_DRAWS: {
                                MORE_WINS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha empatado más de lo que ha ganado y ha ganado más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha empatado más de lo que ha ganado y ha ganado lo mismo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                MORE_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha empatado más de lo que ha perdido y ha perdido más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                            },
                            MORE_LOSES: {
                                MORE_WINS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha perdido más de lo que ha ganado y ha ganado más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha perdido más de lo que ha ganado y ha ganado lo mismo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                                MORE_DRAWS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha perdido más de lo que ha empatado y ha empatado más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                            },
                            SAME_WINS_AND_DRAWS: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha ganado lo mismo que ha empatado, siendo más de lo que ha perdido: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME_WINS_AND_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha ganado lo mismo que ha perdido, siendo más de lo que ha empatado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME_DRAWS_AND_LOSES: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b>, el equipo <b>{visitorTeam}</b> como visitante ha empatado lo mismo que ha perdido, siendo más de lo que ha ganado: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).',
                            SAME: 'En la fila <b>{row}</b> y en la competición <b>{competition}</b> hay máxima igualdad puesto que el número de victorias locales, empates y victorias visitantes es idéntico: <b>{numWins}</b>V (<b>{perWins}%</b>), <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numLoses}</b>D (<b>{perLoses}%</b>).'
                        },
                    }
                }
            },
            MATCH: {
                HISTORICAL: 'El histórico de partidos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> cuenta con los siguientes datos: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                ROW: {
                    NO_DATA: 'No hay registros de partidos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b>.',
                    ONLY_LOCAL_WINS: 'Todos los partidos que se han disputado entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> han terminado en victoria local: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    ONLY_DRAWS: 'Todos los partidos que se han disputado entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> han terminado en empate: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    ONLY_VISITOR_WINS: 'Todos los partidos que se han disputado entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> han terminado en victoria visitante: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    LOCAL_WINS_AND_DRAWS_BUT_NO_VISITOR_WINS: {
                        MORE_LOCAL_WINS_THAN_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido victorias visitantes y hay más victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido victorias visitantes y hay las mismas victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        MORE_DRAWS_THAN_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido victorias visitantes y hay más empates que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    },
                    LOCAL_WINS_AND_VISITOR_WINS_BUT_NO_DRAWS: {
                        MORE_LOCAL_WINS_THAN_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido empates y el equipo local ha ganado más veces que el visitante: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido empates y ambos equipos han ganado el mismo número de veces: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        MORE_VISITOR_WINS_THAN_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido empates y hay más victorias visitantes que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    },
                    DRAWS_AND_VISITOR_WINS_BUT_NO_LOCAL_WINS: {
                        MORE_DRAWS_THAN_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido victorias locales y hay más empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido victorias locales y hay los mismos empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        MORE_VISITOR_WINS_THAN_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> no se han producido victorias locales y hay más victorias visitantes que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    },
                    LOCAL_WINS_DRAWS_AND_VISITOR_WINS: {
                        MORE_LOCAL_WINS: {
                            MORE_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más victorias locales que empates y más empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más victorias locales que empates y mismos empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            MORE_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más victorias locales que victorias visitantes y más victorias visitantes que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        },
                        MORE_DRAWS: {
                            MORE_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más empates que victorias locales y más victorias locales que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más empates que victorias locales y las mismas victorias locales que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            MORE_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más empates que victorias visitantes y más victorias visitantes que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        },
                        MORE_VISITOR_WINS: {
                            MORE_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más victorias visitantes que victorias locales y más victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más victorias visitantes que victorias locales y mismas victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            MORE_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay más victorias visitantes que empates y más empates que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.'
                        },
                        SAME_LOCAL_WINS_AND_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay las mismas victorias locales que empates, siendo más que las victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        SAME_LOCAL_WINS_AND_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay las mismas victorias locales que victorias visitantes, siendo más que los empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        SAME_DRAWS_AND_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay los mismos empates que victorias visitantes, siendo más que las victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la fila <b>{row}</b> hay máxima igualdad puesto que el número de victorias locales, empates y victorias visitantes es idéntico: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.'
                    }
                },
                COMPETITION: {
                    HISTORICAL: 'El histórico de partidos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> cuenta con los siguientes datos: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                    ROW: {
                        NO_DATA: 'No hay registros de partidos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y la fila <b>{row}</b>.',
                        ONLY_LOCAL_WINS: 'Todos los partidos que se han disputado entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en victoria local: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        ONLY_DRAWS: 'Todos los partidos que se han disputado entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en empate: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        ONLY_VISITOR_WINS: 'Todos los partidos que se han disputado entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> han terminado en victoria visitante: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        LOCAL_WINS_AND_DRAWS_BUT_NO_VISITOR_WINS: {
                            MORE_LOCAL_WINS_THAN_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido victorias visitantes y hay más victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido victorias visitantes y hay las mismas victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            MORE_DRAWS_THAN_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido victorias visitantes y hay más empates que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        },
                        LOCAL_WINS_AND_VISITOR_WINS_BUT_NO_DRAWS: {
                            MORE_LOCAL_WINS_THAN_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido empates y hay más victorias locales que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido empates y hay las mismas victorias locales que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            MORE_VISITOR_WINS_THAN_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido empates y hay más victorias visitantes que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        },
                        DRAWS_AND_VISITOR_WINS_BUT_NO_LOCAL_WINS: {
                            MORE_DRAWS_THAN_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido victorias locales y hay más empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido victorias locales y hay los mismos empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            MORE_VISITOR_WINS_THAN_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> no se han producido victorias locales y hay más victorias visitantes que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                        },
                        LOCAL_WINS_DRAWS_AND_VISITOR_WINS: {
                            MORE_LOCAL_WINS: {
                                MORE_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más victorias locales que empates y más empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                                SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más victorias locales que empates y mismos empates que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                                MORE_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más victorias locales que victorias visitantes y más victorias visitantes que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.'
                            },
                            MORE_DRAWS: {
                                MORE_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más empates que victorias locales y más victorias locales que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                                SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más empates que victorias locales y mismas victorias locales que victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                                MORE_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más empates que victorias visitantes y más victorias visitantes que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.'
                            },
                            MORE_VISITOR_WINS: {
                                MORE_LOCAL_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más victorias visitantes que victorias locales y más victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                                SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más victorias visitantes que victorias locales y mismas victorias locales que empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                                MORE_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay más victorias visitantes que empates y más empates que victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.'
                            },
                            SAME_LOCAL_WINS_AND_DRAWS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay las mismas victorias locales que empates, siendo más que las victorias visitantes: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME_LOCAL_WINS_AND_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay las mismas victorias locales que victorias visitantes, siendo más que los empates: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME_DRAWS_AND_VISITOR_WINS: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay los mismos empates que victorias visitantes, siendo más que las victorias locales: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.',
                            SAME: 'En los enfrentamientos entre <b>{localTeam}</b> y <b>{visitorTeam}</b> en la competición <b>{competition}</b> y en la fila <b>{row}</b> hay máxima igualdad puesto que el número de victorias locales, empates y victorias visitantes es idéntico: <b>{numWinsLocal}</b>V (<b>{perWinsLocal}%</b>) del equipo <b>{localTeam}</b>, <b>{numDraws}</b>E (<b>{perDraws}%</b>) y <b>{numWinsVisitor}</b>V (<b>{perWinsVisitor}%</b>) del equipo <b>{visitorTeam}</b>.'
                        }
                    }
                }
            }
        };

        var service = {
            // Tickets
            getAllTickets: getAllTickets,
            getTicketBySeasonAndDay: getTicketBySeasonAndDay,
            createTicket: createTicket,
            editTicket: editTicket,
            ticketHasForecasts: ticketHasForecastsFn,
            getPrize: getPrizeFn,
            // Seasons
            getAllSeasons: getAllSeasons,
            getSeasonById: getSeasonById,
            createSeason: createSeason,
            editSeason: editSeason,
            deleteSeasonById: deleteSeasonById,
            // Competitions
            getAllCompetitions: getAllCompetitions,
            getCompetitionById: getCompetitionById,
            createCompetition: createCompetition,
            editCompetition: editCompetition,
            deleteCompetitionById: deleteCompetitionById,
            // Teams
            getAllTeams: getAllTeams,
            getTeamById: getTeamById,
            createTeam: createTeam,
            editTeam: editTeam,
            deleteTeamById: deleteTeamById,
            // Historical
            getHistorical: getHistorical,
            getHistoricalCombinations: getHistoricalCombinations,
            // Analyzer messages
            ANALYZER_MESSAGES: ANALYZER_MESSAGES,
        };

        return service;

        function getAllTickets(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/tickets", {
                    params: queryParameters
                })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err.data);
                });

            return promise;
        }

        function getTicketBySeasonAndDay(season, day) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/tickets/season/" + season + "/day/" + day)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createTicket(ticket) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/tickets", ticket)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editTicket(ticket) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/tickets", ticket)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllSeasons() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/seasons")
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getSeasonById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/seasons/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createSeason(season) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/seasons", season)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editSeason(season) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/seasons", season)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteSeasonById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete(apiPrefix + "/seasons/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllCompetitions() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/competitions")
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getCompetitionById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/competitions/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createCompetition(competition) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/competitions", competition)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editCompetition(competition) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/competitions", competition)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteCompetitionById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete(apiPrefix + "/competitions/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getAllTeams() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/teams")
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getTeamById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/teams/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function createTeam(team) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .post(apiPrefix + "/teams", team)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function editTeam(team) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .put(apiPrefix + "/teams", team)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function deleteTeamById(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .delete(apiPrefix + "/teams/" + id)
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getHistorical(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical", {
                    params: queryParameters
                })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function getHistoricalCombinations(queryParameters) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http
                .get(apiPrefix + "/historical/combinations", {
                    params: queryParameters
                })
                .then(function (data) {
                    defered.resolve(data.data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        /**
         * Método que sirve para saber si en un ticket se ha realizado alguna apuesta
         *
         * @param {*} ticket
         */
        function ticketHasForecastsFn(ticket) {
            var res = false;

            if (
                ticket != null &&
                ticket.partidos != null &&
                ticket.partidos[0] &&
                ticket.partidos[0].pronosticos
            ) {
                res = ticket.partidos[0].pronosticos.length > 0;
            }
            return res;
        }

        /**
         * Método que sirve para saber la cuantía del premio de un ticket.
         *
         * @param {*} ticket
         *
         * @author jualoppaz
         */
        function getPrizeFn(ticket) {
            var res = 0;

            if (ticket && ticket.premio != null) {
                res = ticket.premio;
            }
            return res;
        }
    }
})();
