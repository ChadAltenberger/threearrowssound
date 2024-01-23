import triggerPopup from "../components/_trigger-popup.js";
import { html } from "../base/_utilities.js";
import { songs } from "../components/_song-list.js";
import getAndSetDistance from "../components/_set-line-width.js";
import WaveSurfer from "wavesurfer.js";

export default function indexInit() {
    /* =================== SET LINE WIDTHS ================== */
    const arrowsWrapper = document.querySelector(".arrows-wrapper");
    const arrowsLineLeft = document.querySelector(".top-left");
    const arrowsLineRight = document.querySelector(".bottom-right");

    const footerLogoWrapper = document.querySelector("#footer-logo-wrapper");
    const footerLineLeft = document.querySelector(".footer-top-left");
    const footerLineRight = document.querySelector(".footer-bottom-right");

    getAndSetDistance(arrowsWrapper, arrowsLineLeft, "left");
    getAndSetDistance(arrowsWrapper, arrowsLineRight, "right");

    getAndSetDistance(footerLogoWrapper, footerLineLeft, "left");
    getAndSetDistance(footerLogoWrapper, footerLineRight, "right");

    let oldWidth = window.innerWidth;

    window.addEventListener("resize", () => {
        if (window.innerWidth !== oldWidth) {
            getAndSetDistance(arrowsWrapper, arrowsLineLeft, "left");
            getAndSetDistance(arrowsWrapper, arrowsLineRight, "right");
            getAndSetDistance(footerLogoWrapper, footerLineLeft, "left");
            getAndSetDistance(footerLogoWrapper, footerLineRight, "right");

            oldWidth = window.innerWidth;
        }
    });

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
}
