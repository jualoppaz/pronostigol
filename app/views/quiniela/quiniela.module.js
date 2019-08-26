"use strict";

const MODULE_NAME = "quiniela";

import routing from "./quiniela.routes";

export default angular.module(MODULE_NAME, []).config(routing).name;
