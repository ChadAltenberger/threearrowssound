import { Offcanvas } from "bootstrap";

export default function navigationInit() {
    const navLinks = document.querySelectorAll(".nav-link");
    const bsOffcanvas = new Offcanvas("#offcanvas-navbar");
    const toggler = document.querySelector(".animated-toggler");

    toggler.addEventListener("click", () => {
        toggler.classList.add("opened");
        setTimeout(() => {
            bsOffcanvas.show();
            // toggler.classList.remove("opened");
        }, 350);
    });

    document.querySelector("#offcanvas-navbar").addEventListener("hidden.bs.offcanvas", () => {
        toggler.classList.remove("opened");
    });

    function toggleOffcanvas() {
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                setTimeout(() => {
                    bsOffcanvas.hide();
                }, 400);
            });
        });
    }

    function passHandler(event) {
        let oldWidth = window.innerWidth;
        window.addEventListener(event, () => {
            if (event === "load") {
                toggleOffcanvas();
            } else if (event === "resize") {
                if (window.innerWidth < 992 && window.innerWidth !== oldWidth) {
                    toggleOffcanvas;
                    oldWidth = window.innerWidth;
                }
            }
        });
    }

    passHandler("load");
    passHandler("resize");
}
