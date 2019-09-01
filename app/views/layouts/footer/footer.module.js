"use strict";

import footerCtrl from "./footer.controller";

const MODULE_NAME = "pronostigol.footer";

export default angular
    .module(MODULE_NAME, [])
    .controller("FooterController", footerCtrl).name;
