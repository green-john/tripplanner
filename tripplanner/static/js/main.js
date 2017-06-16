import * as axios from 'https://unpkg.com/axios/dist/axios.min.js';

export function configure(aurelia) {
    "use strict";
    const ROOT_ELEMENT_ID = 'main_panel';
    const ENTRY_POINT = 'static/js/router';

    // Register libraries for use with Aurelia's DI
    let container = aurelia.container;
    container.registerInstance('axios', axios);

    aurelia.use.basicConfiguration();
    aurelia.start()
        .then(() => aurelia.setRoot(ENTRY_POINT, document.getElementById(ROOT_ELEMENT_ID)));

    console.log("asdf");
}