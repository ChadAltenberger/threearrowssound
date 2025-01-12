/* ========================= NPM ======================== */
// jQuery
// import "./base/_jquery-global.js";

// Popper.js (* tooltip, popover, dropdown)
// import * as Popper from "@popperjs/core";

// Use following imports only where needed (not globally)
// Bootstrap modules (add as needed)
import "bootstrap/js/dist/scrollspy";

// AOS
import AOS from "aos";
AOS.init();

/* ======================== BASE ======================== */
import { utl_setFooterYear } from "./base/_utilities.js";
utl_setFooterYear();

/* ===================== COMPONENTS ===================== */
// import ehElementsInit from "./components/_eh-elements.js";
// ehElementsInit();

// import stickySideInit from "./components/_sticky-sides.js";
// stickySideInit();

import navigationInit from "./components/_navigation.js";
navigationInit();

/* ======================== PAGES ======================= */
