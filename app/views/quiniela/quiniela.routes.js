"use strict";

import quinielaStatsCtrl from "./stats/stats.controller";

function routing($stateProvider) {
    $stateProvider
        .state("quiniela", {
            url: "/quiniela",
            abstract: true,
            parent: "layout",
            resolve: {}
        })
        .state("quiniela.stats", {
            url: "/estadisticas",
            views: {
                "content@layout": {
                    template: "Estadísticas de quiniela",
                    controller: quinielaStatsCtrl,
                    controllerAs: "quinielaStats"
                }
            },
            resolve: {},
            data: {
                displayName: "⚽ Estadísticas"
            }
        });
}

routing.$inject = ["$stateProvider"];
export default routing;
