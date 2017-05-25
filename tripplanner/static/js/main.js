
export function configure(aurelia) {
    "use strict";
    const ROOT_ELEMENT_ID = 'main_panel';
    const ENTRY_POINT = 'config';

    aurelia.use.basicConfiguration();
    aurelia.start()
        .then(() => aurelia.setRoot(ENTRY_POINT, document.getElementById(ROOT_ELEMENT_ID)));
}