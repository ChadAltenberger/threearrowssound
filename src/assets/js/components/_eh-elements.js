/* 
Add 'eh-container' class to element containing all equal-height elements
Add base 'eh' class to each element to be equal height
Add any responsive class to break equal height below breakpoint ('eh-sm', 'eh-md', 'eh-lg', 'eh-xl', 'eh-xxl')
*/

export default function ehElementsInit() {
    let containerClasses = []; // Set empty array to store each container-classList

    function getAndSetHeights() {
        let ehContainers = document.querySelectorAll(".eh-container");
        for (let i = 0; i < ehContainers.length; i++) {
            // Add differentiating numbers to 'eh-container' classes (keeps equal-height elements contained to their appropriate containers)
            ehContainers[i].classList.replace("eh-container", `eh-container-${i}`);

            // Set the classList of each container to a '.'-separated string
            let containerClass = `.${ehContainers[i].classList.toString().replace(/ /g, ".")}`;

            containerClasses.push(containerClass);

            let equalHeightEls = document.querySelectorAll(
                `${containerClass} .eh` // Target the equal-height elements within their eh-containers
            );

            let equalHeightElsArr = Array.from(equalHeightEls); // Convert NodeList to an Array

            // Get heights of each element and put in a new array (equalHeightValues)
            let equalHeightValues = equalHeightElsArr.map((el) => {
                return el.scrollHeight;
            });

            let maxHeight = Math.max(...equalHeightValues); // Get height of tallest element

            // equalHeightElsArr.forEach((el) => {
            //     if (el.scrollHeight < maxHeight) {
            //         el.scrollHeight = maxHeight;
            //     }
            // });

            equalHeightElsArr.forEach((el) => {
                el.style.minHeight = `${maxHeight}px`;
            });
        }
    }

    function resizeHeights() {
        containerClasses.forEach((container) => {
            let elements = document.querySelectorAll(`${container} .eh`);
            let elementsArr = Array.from(elements);
            let maxHeight = 0;

            elementsArr.forEach((el) => {
                el.style.minHeight = "auto";
                if (el.scrollHeight > maxHeight) {
                    maxHeight = el.scrollHeight;
                }
            });

            elementsArr.forEach((el) => {
                el.style.minHeight = `${maxHeight}px`;
            });
        });
    }

    window.addEventListener("load", getAndSetHeights);
    window.addEventListener("resize", () => {
        // Give browser a chance to reset heights before resizing
        setTimeout(() => {
            resizeHeights();
        }, 100);
    });
}
