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
    /*                        NON ASYNC                       */
    /* ****************************************************** */
    // document.addEventListener("DOMContentLoaded", async () => {
    //     const songs = [
    //         {
    //             waveformId: "different-wave",
    //             mp3: "assets/audio/different-wave.mp3",
    //         },
    //         {
    //             waveformId: "mexico",
    //             mp3: "assets/audio/different-wave.mp3",
    //         },
    //         {
    //             waveformId: "the-hills",
    //             mp3: "assets/audio/different-wave.mp3",
    //         },
    //         {
    //             waveformId: "bend",
    //             mp3: "assets/audio/different-wave.mp3",
    //         },
    //         // Add more songs as needed
    //     ];

    //     const playButtons = document.querySelectorAll(".play");

    //     function createWaveSurfer(index, waveFormId, mp3Path) {
    //         const wavesurfer = WaveSurfer.create({
    //             container: `#waveform-${waveFormId}`,
    //             waveColor: "#00abac",
    //             progressColor: "#00ABAC99",
    //             responsive: true,
    //             height: 50,
    //             backend: "WebAudio",
    //             plugins: [
    //                 // Add any necessary plugins
    //             ],
    //         });

    //         wavesurfer.load(mp3Path);

    //         wavesurfer.on("play", () => {
    //             showPause(index);
    //             pauseOtherPlayers(index);
    //         });

    //         wavesurfer.on("pause", () => {
    //             showPlay(index);
    //         });

    //         return wavesurfer;
    //     }

    //     function showPause(index) {
    //         playButtons[index].classList.remove("bi-play-circle");
    //         playButtons[index].classList.add("bi-pause-circle");
    //     }

    //     function showPlay(index) {
    //         playButtons[index].classList.remove("bi-pause-circle");
    //         playButtons[index].classList.add("bi-play-circle");
    //     }

    //     function pauseOtherPlayers(currentIndex) {
    //         waveSurfers.forEach((wavesurfer, index) => {
    //             if (index !== currentIndex && wavesurfer.isPlaying()) {
    //                 wavesurfer.pause();
    //                 showPlay(index);
    //             }
    //         });
    //     }

    //     const waveSurfers = [];

    //     // Initialize WaveSurfer instances for each player
    //     for (let i = 0; i < playButtons.length; i++) {
    //         const wavesurfer = createWaveSurfer(i, songs[i].waveformId, songs[i].mp3);
    //         waveSurfers.push(wavesurfer);

    //         // Add click event listener to each play button
    //         playButtons[i].addEventListener("click", () => {
    //             // Play/pause the corresponding WaveSurfer instance
    //             waveSurfers[i].playPause();
    //         });
    //     }
    // });

    /* ****************************************************** */
    /*                          ASYNC                         */
    /* ****************************************************** */
    document.addEventListener("DOMContentLoaded", async () => {
        const samplesWrapper = document.querySelector("#samples-wrapper");

        // Render HTML for each song
        songs.forEach((song) => {
            samplesWrapper.innerHTML += html`
                <div class="col">
                    <div class="music p-3 bg-primary">
                        <p class="song-title text-white mb-0 d-inline">${song.songTitle}</p>
                        <span class="d-inline text-gray">-</span>
                        <p class="artist text-gray mb-0 d-inline"><small> ${song.artist}</small></p>
                        <div class="track d-flex mt-2">
                            <div class="play bi bi-play-circle d-inline-block text-white fs-2 me-2"></div>
                            <div id="waveform-${song.waveformId}" class="w-100"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Assuming you have 8 play buttons with the class ".play"
        const playButtons = document.querySelectorAll(".play");

        // Function to create a WaveSurfer instance for a given player index
        function createWaveSurfer(index, waveFormId, mp3Path) {
            return new Promise((resolve) => {
                const wavesurfer = WaveSurfer.create({
                    container: `#waveform-${waveFormId}`,
                    waveColor: "#00abac",
                    progressColor: "#00ABAC99",
                    responsive: true,
                    height: 45,
                    url: `${mp3Path}`, // Adjust the naming convention of your audio files
                    backend: "WebAudio", // Specify the backend to avoid issues with async initialization
                    plugins: [
                        // Add any necessary plugins
                    ],
                });

                wavesurfer.on("ready", () => {
                    resolve(wavesurfer);
                });

                wavesurfer.on("play", () => {
                    showPause(index);
                    pauseOtherPlayers(index);
                });

                wavesurfer.on("pause", () => {
                    showPlay(index);
                });
            });
        }

        // Function to show pause icon for a specific player
        function showPause(index) {
            playButtons[index].classList.remove("bi-play-circle");
            playButtons[index].classList.add("bi-pause-circle");
        }

        // Function to show play icon for a specific player
        function showPlay(index) {
            playButtons[index].classList.remove("bi-pause-circle");
            playButtons[index].classList.add("bi-play-circle");
        }

        // Function to pause other players when a new song starts playing
        function pauseOtherPlayers(currentIndex) {
            waveSurfers.forEach((wavesurfer, index) => {
                if (index !== currentIndex && wavesurfer.isPlaying()) {
                    wavesurfer.pause();
                    showPlay(index); // Update the play icon for the paused player
                }
            });
        }

        // Create an array to store WaveSurfer instances
        const waveSurfers = [];

        // Initialize WaveSurfer instances for each player concurrently
        const promises = songs.map((song, i) => createWaveSurfer(i, song.waveformId, song.mp3));
        waveSurfers.push(...(await Promise.all(promises)));

        // Add click event listener to each play button
        playButtons.forEach((playButton, i) => {
            playButton.addEventListener("click", () => {
                // Play/pause the corresponding WaveSurfer instance
                waveSurfers[i].playPause();
            });
        });
    });

    /* ============= TRIGGER POPUP ON PAGE LOAD ============= */
    // triggerPopup("#popup");
}
