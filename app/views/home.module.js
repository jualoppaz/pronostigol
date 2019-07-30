"use strict";

const MODULE_NAME = "home";

import uirouter from "@uirouter/angularjs";

import routing from "./home.routes";
import home from "./home.controller";

export default angular
    .module(MODULE_NAME, [uirouter])
    .config(routing)
    .controller(home).name;
