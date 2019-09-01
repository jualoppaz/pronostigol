"use strict";

import mainCtrl from "./main.controller";

const MODULE_NAME = "pronostigol.main";

export default angular
    .module(MODULE_NAME, [])
    .controller("MainController", mainCtrl).name;
