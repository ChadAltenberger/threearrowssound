/* ******************** NPM ******************** */
// Use following imports only where needed (not globally)
// Bootstrap modules (add as needed)
import "bootstrap/js/dist/scrollspy";

/* ******************** BASE ******************** */
// Import utilities as needed
import {
    utl_keyboardFocusMode,
    utl_setFooterYear,
    utl_handleModalClose,
    // utl_ehElements,
    // utl_toggleCookiesAlert,
    // utl_anchorScrollOffset,
} from "./base/_utils";

// Call utility functions after imported
utl_keyboardFocusMode();
utl_setFooterYear();
utl_handleModalClose();
// utl_ehElements();
// utl_toggleCookiesAlert();
// utl_anchorScrollOffset();

/* ******************** COMPONENTS ******************** */
import navigationInit from "./components/_navigation";

navigationInit();

/* ******************** PAGES ******************** */
// Individual page scripts are added in the header of specific page's index file
