// TRIGGER POPUP MODAL ON PAGE LOAD
import Modal from "bootstrap/js/dist/modal";

export default function triggerPopup(modalId, delay = 0) {
    const element = document.querySelector(modalId);

    if (!element) return;

    const popup = new Modal(element);

    setTimeout(() => {
        popup.show();
    }, delay);
}
