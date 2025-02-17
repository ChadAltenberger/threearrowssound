import triggerPopup from "../components/_trigger-popup.js";
import { html, utl_scrollSpyOffset } from "../base/_utilities.js";
import { songs } from "../components/_song-list.js";
import getAndSetDistance from "../components/_set-line-width.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

console.log("index");

/* =================== SET LINE WIDTHS ================== */
const footerLogoWrapper = document.querySelector("#footer-logo-wrapper");
const footerLineLeft = document.querySelector(".footer-top-left");
const footerLineRight = document.querySelector(".footer-bottom-right");

getAndSetDistance(footerLogoWrapper, footerLineLeft, "left");
getAndSetDistance(footerLogoWrapper, footerLineRight, "right");

let oldWidth = window.innerWidth;

/* ****************************************************** */
/*                      AUDIO PLAYERS                     */
/* ****************************************************** */

// Get the wrapper element
const samplesWrapper = document.getElementById("samples-wrapper");

// Store the currently playing audio element
let currentAudio = null;

// Loop through the array of songs and create the audio player HTML
songs.forEach((song) => {
    samplesWrapper.innerHTML += html`
        <div class="col">
            <div class="audio-player d-flex align-items-center bg-primary">
                <div class="btn-wrapper d-flex justify-content-center align-items-center">
                    <div class="play-pause-btn bi bi-play-fill d-inline-block text-white fs-2"></div>
                </div>
                <div class="track-info d-flex flex-column justify-content-center">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar"></div>
                    </div>
                    <p class="song-title text-white lh-1 mb-0 ms-2">${song.songTitle}</p>
                    <p class="artist text-gray mb-0 ms-2"><small>${song.artist}</small></p>
                </div>
                <audio id="${song.audioId}">
                    <source src="${song.mp3}" type="audio/mp3" />
                </audio>
            </div>
        </div>
    `;
});

// Add event listeners for each audio player
const audioPlayers = document.querySelectorAll(".audio-player");

audioPlayers.forEach((player) => {
    const audio = player.querySelector("audio");
    const btnWrapper = player.querySelector(".btn-wrapper");
    const playPauseBtn = player.querySelector(".play-pause-btn");
    const progressBar = player.querySelector(".progress-bar");
    const progressBarWrapper = player.querySelector(".progress-bar-wrapper");

    btnWrapper.addEventListener("click", togglePlayPause);
    progressBarWrapper.addEventListener("click", handleProgressBarClick);
    audio.addEventListener("timeupdate", updateProgressBar);

    // Toggle Play/Pause state
    function togglePlayPause() {
        if (audio.paused) {
            // Pause previously playing audio (if any)
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                const prevPlayPauseBtn = currentAudio.parentElement.querySelector(".play-pause-btn");
                prevPlayPauseBtn.classList.remove("bi-pause");
                prevPlayPauseBtn.classList.add("bi-play-fill");
            }

            // Set current audio to the current one
            currentAudio = audio;

            // Play current audio
            audio.play();
            playPauseBtn.classList.remove("bi-play-fill");
            playPauseBtn.classList.add("bi-pause");
        } else {
            // Pause audio if it's currently playing
            audio.pause();
            playPauseBtn.classList.remove("bi-pause");
            playPauseBtn.classList.add("bi-play-fill");
        }
    }

    // Update progress bar based on audio playback time
    function updateProgressBar() {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    // Handle progress bar click and seek to clicked position
    function handleProgressBarClick(event) {
        const clickX = event.offsetX;
        const progressBarWidth = progressBarWrapper.clientWidth; // Adjusted for border
        const clickPercentage = (clickX / progressBarWidth) * 100;

        // Set progress bar width based on click position
        progressBar.style.width = `${clickPercentage}%`;

        // Calculate new time in audio track based on click position
        const newTime = (clickPercentage / 100) * audio.duration;

        // Set audio playback time to new calculated time
        audio.currentTime = newTime;
    }
});

/* ****************************************************** */
/*                       ANIMATIONS                       */
/* ****************************************************** */
// Function to check if the user is using Chrome on iOS or Safari on iOS
function isIOSChromeOrSafari() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /(iphone|ipod|ipad).*chrome/.test(userAgent) || /iphone|ipod|ipad.*applewebkit.*(safari)/.test(userAgent);
}

window.addEventListener("DOMContentLoaded", () => {
    const introHeight = document.querySelector("#intro").scrollHeight;

    // Your GSAP animations
    gsap.registerPlugin(ScrollTrigger);

    // Single timeline for both animations
    const tl = gsap.timeline({ ease: "power1.inOut" });

    ScrollTrigger.defaults({
        scrub: true,
    });

    if (window.scrollY < 1) {
        // Initial video animation
        tl.from(".video-wrapper", {
            transform: "scale(1)",
            duration: 2,
            delay: 2,
        })
            // Fade in header elements
            .from(
                ".tas-lines",
                {
                    opacity: 0,
                    duration: 1.25,
                },
                "-=3.25"
            )
            .from(
                ".video-overlay",
                {
                    opacity: 1,
                    duration: 2,
                },
                "-=2"
            )
            .from(".arrows-wrapper", {
                opacity: 0,
                duration: 2,
            })
            .from(
                ".header-logo",
                {
                    opacity: 0,
                    duration: 2,
                },
                "-=2"
            );
    }

    // Only include the following animation if not on Chrome on iOS or Safari on iOS
    if (!isIOSChromeOrSafari()) {
        // // Pin scrolling of video
        gsap.to(".video-wrapper", {
            y: "-84vh",
            scrollTrigger: {
                trigger: ".pin-trigger",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                pin: ".pin-wrapper",
            },
        });
    }

    tl
        // Bring in navbar
        .to("#main-nav", {
            marginTop: 0,
            scrollTrigger: {
                trigger: "#about",
                start: `-${introHeight - 100} bottom`,
                end: "top center",
                // markers: true,
            },
        })
        // Sub heading slide to right
        .to(".sub-text-1", {
            x: 0,
            scrollTrigger: {
                trigger: "#about",
                start: `-${introHeight} bottom`,
                end: "top center",
                // markers: true,
            },
        })
        .to(".sub-text-2", {
            x: 0,
            scrollTrigger: {
                trigger: "#about",
                start: `-${introHeight + 200} bottom`,
                end: "top center",
                // markers: true,
            },
        })
        // Parallax section
        .to(".portfolio-bg", {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
            ease: "none",
            scrollTrigger: {
                trigger: "#portfolio",
                start: "top bottom",
                end: "bottom top",
            },
        })
        .to("#services", {
            marginTop: "-18rem",
            scrollTrigger: {
                trigger: "#services",
                start: "top bottom",
                end: "bottom top",
            },
        })
        // Lines on bottom of Services
        .to(".spaced-lines", {
            scrollTrigger: {
                trigger: "#spaced-lines-trigger",
                toggleClass: { targets: ".spaced-lines", className: "animated" },
                scrub: false,
                once: true,
                // markers: true,
            },
        });
});

window.addEventListener("resize", () => {
    if (window.innerWidth !== oldWidth) {
        getAndSetDistance(footerLogoWrapper, footerLineLeft, "left");
        getAndSetDistance(footerLogoWrapper, footerLineRight, "right");
        utl_scrollSpyOffset();

        oldWidth = window.innerWidth;
    }
});

utl_scrollSpyOffset();
