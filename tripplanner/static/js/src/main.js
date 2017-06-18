import { PLATFORM } from 'aurelia-pal';
import * as axios from 'axios';

export function configure(aurelia) {
    "use strict";
    const ROOT_ELEMENT_ID = 'main_panel';
    const ENTRY_POINT = PLATFORM.moduleName('router');

    // Register libraries for use with Aurelia's DI
    let container = aurelia.container;
    container.registerInstance('axios', axios);

    aurelia.use.standardConfiguration()
        .developmentLogging()
        .plugin(PLATFORM.moduleName('aurelia-dialog'));

    aurelia.start()
        .then(() => aurelia.setRoot(ENTRY_POINT, document.getElementById(ROOT_ELEMENT_ID)));
}