"use strict";

const startButton = document.querySelector("#start-button");

startButton.addEventListener("click", () => {});

function songList(songTitle) {
  const selectedItem = document.querySelector("select").value;
  if (selectedItem === " beat-city") {
    bpm = 120;
    duration = 270 * 1000;
    delay = 3200;
  }
  endTime = startTime + duration;
}
