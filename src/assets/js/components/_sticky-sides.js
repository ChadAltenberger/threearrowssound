/*
 * Make sure the direct parent container is positioned relative AND IS NOT A BOOTSTRAP COLUMN (.col-xx)
 * Add "sticky-side-left" or "sticky-side-right" class to element to be set to either edge
 * Add responsive classes to add sticky-side above breakpoints ("sticky-side-sm", "sticky-side-md", "sticky-side-lg")
 * For sticky-side-right, element must also be positioned relative
 */

export default function stickySideInit() {
    let stickySideLeftElements = document.querySelectorAll(".sticky-side-left");
    let stickySideRightElements = document.querySelectorAll(".sticky-side-right");

    function getStickyContainerAndElements() {
        stickySideLeftElements.forEach((element) => {
            // Calculate the left offset of the container
            let containerLeftOffset = element.parentElement.getBoundingClientRect().left;
            // Set the left position of the element to the negative of the container's left offset
            element.style.cssText = `margin-left: calc(${-containerLeftOffset}px - var(--bs-gutter-x) * .5);`;
        });

        stickySideRightElements.forEach((element) => {
            // Calculate the right offset of the container
            let containerRightOffset = element.parentElement.getBoundingClientRect().right;
            // Calculate the difference of window width and right offset to get distance from right edge
            let rightDistance = window.innerWidth - containerRightOffset;
            // Set the right position of the element to the negative of the container's right offset
            element.style.right = `${-rightDistance}px`;
        });
    }

    window.addEventListener("load", getStickyContainerAndElements);
    window.addEventListener("resize", getStickyContainerAndElements);
}
