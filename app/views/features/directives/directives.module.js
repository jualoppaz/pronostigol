"use strict";

import menuLink from "./menu-link/menu-link.directive";
import menuToggle from "./menu-toggle/menu-toggle.directive";

const MODULE_NAME = "pronostigol.directives";

export default angular
    .module(MODULE_NAME, [])
    .directive("menuLink", menuLink)
    .directive("menuToggle", menuToggle).name;
