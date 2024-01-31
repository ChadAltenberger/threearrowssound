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
import { utl_setYear, utl_pageId } from "./base/_utilities.js";
// utl_setYear();

/* ===================== COMPONENTS ===================== */
// import ehElementsInit from "./components/_eh-elements.js";
// ehElementsInit();

// import stickySideInit from "./components/_sticky-sides.js";
// stickySideInit();

import navbarInit from "./components/_navbar.js";
navbarInit();

/* ======================== PAGES ======================= */
import indexInit from "./pages/index.js";
utl_pageId === "main-index" && indexInit();
