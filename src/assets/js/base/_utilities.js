const utl_pageId = document.querySelector("body").getAttribute("id");
const utl_setYear = () => (document.querySelector("#current-year").innerHTML = new Date().getFullYear());
const utl_parseData = (data) => {
    // Return a Promise which contains Papa.parse method and will either resolve with parsed data or reject with an error
    return new Promise((resolve, reject) => {
        Papa.parse(data, {
            download: true,
            header: true,
            complete: resolve, // If completes with no errors, Promise will resolve and any subsequent code will be executed
            error: reject, // If any error with parsing, Promise will reject and no subsequent code will be executed
        });
    });
};
const html = String.raw;
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

export { utl_pageId, utl_setYear, utl_parseData, html, utl_scrollSpyOffset };
