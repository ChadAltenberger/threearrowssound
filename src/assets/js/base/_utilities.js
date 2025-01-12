function utl_scrollSpyOffset() {
    const link = document.querySelector(".scrollspy-offset");

    link.addEventListener("click", function (e) {
        e.preventDefault();
        // Get anchor section's hash(id) value

        // Get anchor section's vertical offset from top of the document
        const targetOffsetTop = document.querySelector("#services").offsetTop;

        if (window.innerWidth >= 992) {
            // Scroll to calculated target offset from top of document, minus navbar height
            window.scrollTo({
                top: targetOffsetTop - 250,
            });
        } else {
            window.scrollTo({
                top: targetOffsetTop - 140,
            });
        }
    });
}

/* ========= GET AND SET CURRENT YEAR IN FOOTER ========= */
const utl_setFooterYear = () => (document.querySelector("#current-year").innerHTML = new Date().getFullYear());

/* ================= GET PAGE'S BODY ID ================= */
const utl_pageId = () => document.querySelector("body").getAttribute("id");

/* ====== FORMAT TEMPLATE LITERALS AS REGULAR HTML ====== */
const html = String.raw;

export { utl_scrollSpyOffset, utl_setFooterYear, utl_pageId, html };
