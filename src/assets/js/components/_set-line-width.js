// Get distance from element (w/ line) and set width of line to edge of screen
export default function getAndSetDistance(el, line, direction) {
    if (direction == "right") {
        let distanceToRightEdge = el.getBoundingClientRect().right; // The distance from the element with a line to right of screen

        let totalDistance = window.innerWidth - distanceToRightEdge;

        // Set the width of the 'line' to span the distance of the 'slash' to the edge of screen
        line.style.width = `calc(${totalDistance}px - 1.5rem)`;
    } else if (direction == "left") {
        let distanceToLeftEdge = el.getBoundingClientRect().left; // The distance from the element with a line to left of screen

        // Set the width of the 'line' to span the distance of the 'slash' to the edge of screen
        line.style.width = `calc(${distanceToLeftEdge}px - 1.5rem)`;
    }
}
