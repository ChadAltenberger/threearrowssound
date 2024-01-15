import triggerPopup from "../components/_trigger-popup.js";
import getAndSetDistance from "../components/_set-line-width.js";

export default function indexInit() {
    /* =================== SET LINE WIDTHS ================== */
    const arrowsWrapper = document.querySelector(".arrows-wrapper");
    const arrowsLineLeft = document.querySelector(".top-left");
    const arrowsLineRight = document.querySelector(".bottom-right");
    const line1 = document.querySelector(".line-1");
    const line2 = document.querySelector(".line-2");
    const line1String = line1.querySelector(".string");
    const line2String = line2.querySelector(".string");

    getAndSetDistance(arrowsWrapper, arrowsLineLeft, "left");
    getAndSetDistance(arrowsWrapper, arrowsLineRight, "right");
    // getAndSetDistance(line1, line1String, "right");
    // getAndSetDistance(line2, line2String, "right");

    /* ============= TRIGGER POPUP ON PAGE LOAD ============= */
    // triggerPopup("#popup");
}
