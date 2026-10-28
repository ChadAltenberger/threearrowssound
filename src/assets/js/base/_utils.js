/* ******************** FORMAT TEMPLATE LITERALS AS REGULAR HTML ******************** */
const html = String.raw;

/* ******************** GET PAGE'S BODY ID ******************** */
const utl_pageId = () => document.querySelector("body").getAttribute("id");

/* ******************** GET AND SET CURRENT YEAR IN FOOTER ******************** */
const utl_setFooterYear = () => (document.querySelector("#current-year").innerHTML = new Date().getFullYear());

/* ******************** SET KEYBOARD MODE FOR TABBING FOCUS STYLES ******************** */
const utl_keyboardFocusMode = () => {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab" || e.key.startsWith("Arrow")) {
            document.body.classList.add("keyboard-focus-mode");
        }
    });

    document.addEventListener("mousedown", () => {
        document.body.classList.remove("keyboard-focus-mode");
    });
};

/* ******************** FADE IN DYNAMICALLY LOADED ELEMENTS ******************** */
const utl_fadeIn = () => {
    requestAnimationFrame(() => {
        document.querySelectorAll(".fade-in").forEach((el) => {
            el.style.opacity = 1;
        });
    });
};

/* ******************** EQUAL HEIGHT ELEMENTS ******************** */
const utl_ehElements = ({ async = false } = {}) => {
    if (!document.querySelector(".eh-container")) return;

    const containerClasses = []; // Set empty array to store each container-classList

    function getAndSetHeights() {
        const ehContainers = document.querySelectorAll(".eh-container");

        ehContainers.forEach((container, i) => {
            // Add differentiating numbers to 'eh-container' classes (keeps equal-height elements contained to their appropriate containers)
            container.classList.replace("eh-container", `eh-container-${i}`);

            // Set the classList of each container to a '.'-separated string
            const containerClass = `.${container.classList.toString().replace(/ /g, ".")}`;

            containerClasses.push(containerClass);

            // Target the equal-height elements within their eh-containers
            // Convert each NodeList to Array to have access to map()
            const equalHeightEls = [...document.querySelectorAll(`${containerClass} .eh`)];

            // Map each element to its scrollHeight
            const equalHeightValues = equalHeightEls.map((el) => el.scrollHeight);

            // Get height of tallest element
            const maxHeight = Math.max(...equalHeightValues);

            equalHeightEls.forEach((el) => {
                el.style.minHeight = `${maxHeight}px`;
            });
        });
    }

    function resizeHeights() {
        containerClasses.forEach((containerClassList) => {
            // Get each .eh element inside its respective .eh-container
            const elements = document.querySelectorAll(`${containerClassList} .eh`);

            let maxHeight = 0;

            elements.forEach((el) => {
                el.style.minHeight = "auto";
                maxHeight = Math.max(maxHeight, el.scrollHeight);
            });

            elements.forEach((el) => {
                el.style.minHeight = `${maxHeight}px`;
            });
        });
    }

    // Run immediately if this was triggered by async data
    if (async) {
        getAndSetHeights();
    } else {
        // Otherwise, wait for the full page load
        if (document.readyState === "complete") {
            getAndSetHeights();
        } else {
            window.addEventListener("load", getAndSetHeights);
        }
    }

    // Add resize event listener with throttling
    let resizeRaf;

    window.addEventListener("resize", () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
            resizeHeights();
            resizeRaf = null;
        });
    });
};

/* ******************** MAKE HIDDEN-BY-DEFAULT ITEMS EQUAL HEIGHTS ******************** */
const utl_ehHiddenItems = (element, selector) => {
    function normalizeSlideHeights() {
        const items = [...element.querySelectorAll(selector)];

        // Walk up from each item (without leaving "element") to find whichever ancestor Bootstrap actually hides via "display: none"
        const hiddenParents = items.map((item) => {
            let el = item;

            while (el && el !== element) {
                if (getComputedStyle(el).display === "none") return el;
                el = el.parentElement;
            }

            return item;
        });

        // Batch write: prep all items for measurement
        items.forEach((item) => {
            Object.assign(item.style, {
                minHeight: "0",
                height: "auto",
                overflow: "visible",
            });
        });

        hiddenParents.forEach((parent) => {
            Object.assign(parent.style, {
                display: "block",
                visibility: "hidden",
            });
        });

        // Batch read: single reflow to get all heights
        const maxHeight = items.reduce((max, item) => Math.max(max, item.offsetHeight), 0);

        // Batch write: apply final heights and reset all at once
        items.forEach((item) => {
            Object.assign(item.style, {
                height: `${maxHeight}px`,
                overflow: "",
            });
        });

        hiddenParents.forEach((parent) => {
            Object.assign(parent.style, {
                display: "",
                visibility: "",
            });
        });
    }

    // Run on load with readyState guard
    if (document.readyState === "complete") {
        normalizeSlideHeights();
    } else {
        window.addEventListener("load", normalizeSlideHeights);
    }

    // Resize with debouncing (width-change only)
    let resizeTimeout;
    let oldWidth = window.innerWidth;

    window.addEventListener("resize", () => {
        if (window.innerWidth !== oldWidth) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(normalizeSlideHeights, 100);
            oldWidth = window.innerWidth;
        }
    });

    window.addEventListener("orientationchange", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(normalizeSlideHeights, 100);
    });
};

/* ******************** RETURN FOCUS TO MODAL TRIGGER ON CLOSE ******************** */
// Be sure to include function call on specific pages AFTER dynamically loaded modals (ex. staff modals)
const utl_handleModalClose = () => {
    const modals = document.querySelectorAll(".modal");
    if (!modals.length) return;

    modals.forEach((modal) => {
        if (modal.dataset.utlHandled) return; // If modal has already had the eventListener added (has data-utl-handled attribute), ignore it.

        modal.addEventListener("hide.bs.modal", () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });

        modal.dataset.utlHandled = "true"; // Add the data-utl-handled attribute so it doesn't get eventListener added more than once
    });
};

/* ******************** PARSE DATA WITH PAPAPARSE ******************** */
const utl_parseData = (data, Papa) => {
    // Return a Promise which contains Papa.parse method and will either resolve with parsed data or reject with an error
    return new Promise((resolve, reject) => {
        Papa.parse(data, {
            download: true,
            header: true,
            comments: "#",
            complete: resolve, // If completes with no errors, Promise will resolve and any subsequent code will be executed
            error: reject, // If any error with parsing, Promise will reject and no subsequent code will be executed
        });
    });
};

/* ******************** OFFSET SCROLL POSITIONS OF ANCHOR ELEMENTS ******************** */
const utl_anchorScrollOffset = () => {
    const offsetElements = document.querySelectorAll("[data-sa-offset]");
    if (!offsetElements.length) return;

    function getOffsetValues() {
        offsetElements.forEach((element) => {
            const offsetValues = element
                .getAttribute("data-sa-offset")
                .split(",")
                .map((value) => value.trim());
            let scrollMarginTop;

            if (offsetValues.length === 1) {
                // Use the single offset value
                scrollMarginTop = offsetValues[0];
            } else {
                // Use the responsive code for two values
                if (window.innerWidth >= 992) {
                    // Desktop
                    scrollMarginTop = offsetValues[1]; // Use the second offset value for larger screens
                } else {
                    // Mobile
                    scrollMarginTop = offsetValues[0]; // Use the first offset value for smaller screens
                }
            }

            console.log(scrollMarginTop);
            element.style.cssText = `scroll-margin-top: ${scrollMarginTop};`;
        });
    }

    getOffsetValues();

    // Add resize event listener with throttling
    let resizeRaf;

    window.addEventListener("resize", () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
            getOffsetValues();
            resizeRaf = null;
        });
    });
};

/* ******************** DELAY MOBILE MENU CLOSE FOR ANCHOR LINKS ******************** */
const utl_handleMobileAnchorLinks = (viewportWidth, bsOffcanvas) => {
    const anchorLinks = document.querySelectorAll(".anchor-link");
    if (!anchorLinks.length || !bsOffcanvas) return;

    // Delay closing menu until page scrolls to anchor
    const closeOffcanvas = () => {
        setTimeout(() => {
            bsOffcanvas.hide();
        }, 400);
    };

    const enableMobile = () => {
        anchorLinks.forEach((link) => {
            link.removeEventListener("click", closeOffcanvas);
            link.addEventListener("click", closeOffcanvas);
        });
    };

    const disableMobile = () => {
        anchorLinks.forEach((link) => {
            link.removeEventListener("click", closeOffcanvas);
        });
    };

    // Media query for mobile
    const mq = window.matchMedia(`(max-width: ${viewportWidth - 0.02}px)`);

    const updateBehavior = (e) => {
        e.matches ? enableMobile() : disableMobile();
    };

    // Run once on load
    updateBehavior(mq);

    // React only when breakpoint changes
    mq.addEventListener("change", updateBehavior);
};

/* ******************** TOGGLE COOKIES ALERT/SET SESSION STORAGE ******************** */
const utl_toggleCookiesAlert = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const cookiesAlert = document.querySelector("#cookies-alert");

        // Check if the flag exists in sessionStorage
        if (!sessionStorage.getItem("cookiesAlertDisplayed")) {
            // If the flag doesn't exist, display the cookies alert after a delay
            setTimeout(() => {
                cookiesAlert.classList.add("visible");
            }, 2000);
        }

        cookiesAlert.querySelector(".close").addEventListener("click", () => {
            cookiesAlert.classList.remove("visible");

            setTimeout(() => {
                cookiesAlert.remove();
            }, 300);

            // Set the flag in sessionStorage indicating that the alert has been displayed
            sessionStorage.setItem("cookiesAlertDisplayed", true);
        });
    });
};

/* ******************** ENSURE FORM SUBMIT REDIRECTS CORRECTLY ******************** */
// If thank-you.kit lives in subdirectory, pass subdirectory as argument: utl_handleFormSubmitRedirect("rsvp");
const utl_handleFormSubmitRedirect = (subDirs = "") => {
    const nextInput = document.querySelector("input[name='_next']");
    if (!nextInput) return;

    const origin = window.location.origin;
    let basePath = "";

    // Dev sites live under /school/site-name/
    if (window.location.hostname === "www.summitathletics-dev.com") {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        basePath = `/${pathParts.slice(0, 2).join("/")}`;
    }

    const normalizedSubDirs = subDirs ? `/${subDirs.replace(/^\/|\/$/g, "")}` : "";

    nextInput.value = `${origin}${basePath}${normalizedSubDirs}/thank-you.html`;
};

/* ******************** RENDER HTML DYNAMICALLY FROM ARRAY OF OBJECTS ******************** */
/**
 * Renders an array of data objects into a target container using a provided template function.
 *
 * @param {Object} params - The parameters object.
 * @param {Array<Object>} params.data - The array of data items to render.
 * @param {(item: Object) => string} params.template - A function that takes a data item and returns an HTML string.
 * @param {string} params.target - A CSS selector string for the container element where the HTML should be injected.
 * @returns {void}
 *
 * @example
 * // Example usage:
 * utl_renderHTML({
 *   data: staff,
 *   template: (member) => html`<div class="col">${staffCard(member, "../")}</div>`,
 *   target: "#staff-container",
 * });
 */
const utl_renderObjects = ({ data, template, target }) => {
    data.forEach((item) => {
        // If target is a function, resolve it for this item
        const resolvedTarget = typeof target === "function" ? target(item) : target;

        const container = document.querySelector(resolvedTarget);
        if (!container) return;

        container.insertAdjacentHTML("beforeend", template(item));
    });
};

/* ******************** EXPORT ALL UTILITIES ******************** */
export {
    html,
    utl_pageId,
    utl_setFooterYear,
    utl_keyboardFocusMode,
    utl_fadeIn,
    utl_ehElements,
    utl_ehHiddenItems,
    utl_handleModalClose,
    utl_parseData,
    utl_anchorScrollOffset,
    utl_handleMobileAnchorLinks,
    utl_toggleCookiesAlert,
    utl_handleFormSubmitRedirect,
    utl_renderObjects,
};
