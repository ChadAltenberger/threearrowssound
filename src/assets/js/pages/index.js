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
    const line1 = document.querySelector(".line-1");
    const line2 = document.querySelector(".line-2");
    const line1String = line1.querySelector(".string");
    const line2String = line2.querySelector(".string");

    getAndSetDistance(arrowsWrapper, arrowsLineLeft, "left");
    getAndSetDistance(arrowsWrapper, arrowsLineRight, "right");
    // getAndSetDistance(line1, line1String, "right");
    // getAndSetDistance(line2, line2String, "right");

    /* ****************************************************** */
    /*                      AUDIO PLAYERS                     */
    /* ****************************************************** */

    // Get the wrapper element
    const samplesWrapper = document.getElementById("samples-wrapper");

    // Store the currently playing audio element
    let currentAudio = null;

    // Loop through the array of songs
    songs.forEach((song) => {
        // Create the audio player HTML
        const audioPlayerHTML = html`
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

        // Append the audio player to the wrapper
        samplesWrapper.innerHTML += audioPlayerHTML;
    });

    // Add event listeners for each audio player (similar to your existing code)
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

        function togglePlayPause() {
            if (audio.paused) {
                // Pause the previously playing audio (if any)
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    const prevPlayPauseBtn = currentAudio.parentElement.querySelector(".play-pause-btn");
                    prevPlayPauseBtn.classList.remove("bi-pause");
                    prevPlayPauseBtn.classList.add("bi-play-fill");
                }

                // Set the current audio to the current one
                currentAudio = audio;

                // Play the current audio
                audio.play();
                playPauseBtn.classList.remove("bi-play-fill");
                playPauseBtn.classList.add("bi-pause");
            } else {
                audio.pause();
                playPauseBtn.classList.remove("bi-pause");
                playPauseBtn.classList.add("bi-play-fill");
            }
        }

        function updateProgressBar() {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percentage + "%";
        }

        function handleProgressBarClick(event) {
            const clickX = event.offsetX;
            const progressBarWidth = progressBarWrapper.clientWidth; // Adjusted for border
            const clickPercentage = (clickX / progressBarWidth) * 100;

            progressBar.style.width = `${clickPercentage}%`;

            const newTime = (clickPercentage / 100) * audio.duration;
            audio.currentTime = newTime;
        }
    });
}
