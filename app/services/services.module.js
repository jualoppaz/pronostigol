import menuService from "./menu.service";

const MODULE_NAME = "pronostigol.services";

export default angular
    .module(MODULE_NAME, [])
    .factory("menuService", menuService).name;
