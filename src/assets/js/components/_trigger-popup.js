/* ========== TRIGGER POPUP MODAL ON PAGE LOAD ========== */
import { Modal } from "bootstrap";

export default function triggerPopup(modalId) {
    window.addEventListener("load", () => {
        let popup = new Modal(modalId);

        popup.show();
    });
}
