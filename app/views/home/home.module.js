"use strict";

const MODULE_NAME = "home";

import routing from "./home.routes";
import home from "./home.controller";

export default angular
    .module(MODULE_NAME, [])
    .config(routing)
    .controller(home).name;
