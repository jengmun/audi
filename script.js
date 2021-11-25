"use strict";

const scoreboard = {
  perfect: 0,
  great: 0,
  cool: 0,
  bad: 0,
  miss: 0,
};

const keyCodes = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
};

const uniCode = {
  37: "&#8592",
  38: "&#8593",
  39: "&#8594",
  40: "&#8595",
};

const chanceUniCode = {
  37: "&#8594",
  38: "&#8595",
  39: "&#8592",
  40: "&#8593",
};

const scoring = {
  1: 1000,
  2: 1500,
  3: 2000,
  4: 2500,
  5: 3000,
  6: 5000,
  7: 5500,
  8: 6000,
  9: 6500,
  9.8: 10000,
};

const songs = {
  "flying-duck": {
    bpm: 156,
    duration: 240 * 1000,
    delay: 1538,
    highScore: 0,
    volume: 1,
  },

  "beat-city": {
    bpm: 120,
    duration: 250 * 1000,
    delay: 3100,
    highScore: 0,
    volume: 0.5,
  },

  you: {
    bpm: 136,
    duration: 250 * 1000,
    delay: 3350,
    highScore: 0,
    volume: 1,
  },

  eve: {
    bpm: 185,
    duration: 219 * 1000,
    delay: 1220,
    highScore: 0,
    volume: 0.3,
  },

  eight: {
    bpm: 120,
    duration: 167 * 1000,
    delay: 1900,
    highScore: 0,
    volume: 0.5,
  },

  "closed-ending": {
    bpm: 95,
    duration: 252 * 1000,
    delay: 2050,
    highScore: 0,
    volume: 0.4,
  },
};

const target = document.querySelector("#target");
const targetWidth = document.querySelector("#target").offsetWidth;
let rhythmBarWidth = document.querySelector("#rhythm-bar").clientWidth;
let bpm = 100;
let playTime = (4 / bpm) * 60 * 1000; // time taken for every 4 beats
let level = 1;
let score = 0;
let currentKeys = [];
let currentKeysHTML = "";
let chainMultiple = -1;
let grade = "";
let pressTime = 0;
let currentRound = 0;
let duration = 0; // in ms
let startpos = 0;
let currentPosition = 0;
let missPoint = startpos + rhythmBarWidth * 0.9;
let startTime = 0;
let endTime = startTime + duration;
let remainingTime = endTime - startTime;
let delay = 0;
let songChosen = "";
let chance = "off";

function getPosition() {
  currentPosition = target.getBoundingClientRect().left + targetWidth / 2;
  window.requestAnimationFrame(getPosition);
}

function grading() {
  rhythmBarWidth = document.querySelector("#rhythm-bar").clientWidth;

  const perfectBeat = startpos + rhythmBarWidth * 0.75;
  const deviation = Math.abs(pressTime - perfectBeat);

  if (deviation < rhythmBarWidth * 0.01) {
    grade = "perfect";
    chainMultiple++;
  } else if (deviation < rhythmBarWidth * 0.05) {
    grade = "great";
  } else if (deviation < rhythmBarWidth * 0.1) {
    grade = "cool";
  } else if (deviation <= rhythmBarWidth * 0.14) {
    grade = "bad";
  } else {
    grade = "miss";
  }

  if (document.querySelector(".key")) {
    grade = "miss";
  }

  if (grade !== "perfect") {
    chainMultiple = -1;
  }

  const multiplier = {
    miss: 0,
    bad: 0.5,
    cool: 1,
    great: 1.5,
    perfect: 2 ** Math.max(1, chainMultiple + 1),
  };

  scoreboard[grade] += 1;

  const gradeDOM = document.querySelector(".grade");
  if (grade === "perfect" && chainMultiple > 0) {
    gradeDOM.innerText = `${grade} x${chainMultiple}`;
  } else {
    gradeDOM.innerText = grade;
  }

  gradeDOM.id = grade;
  gradeDOM.style.animation = `fadeoutgrade ${playTime / 2000}s 1 forwards`;
  setTimeout(function () {
    gradeDOM.style.animation = "";
    gradeDOM.style.opacity = "0";
  }, playTime / 2 + 1);

  if (chance === "on" && level >= 6 && level < 9.8) {
    score += multiplier[grade] * scoring[Math.floor(level)] * 2;
  } else {
    score += multiplier[grade] * scoring[Math.floor(level)];
  }

  document.querySelector("#score").innerText = score.toLocaleString("en");
}

function nextLevel() {
  if (level < 6) {
    level++;
  } else if (level < 9) {
    level += 0.25;
  } else if (level < 9.8) {
    level += 0.2;
    level = Math.round(level * 10) / 10;
  } else if (level === 9.8) {
    level = 6;
  }

  const levelLabel = document.querySelector(".level-label");
  const levelNumber = document.querySelector(".level-number");

  if (level < 9.8) {
    levelNumber.removeAttribute("id", "finish-move");
    levelLabel.innerText = `Level `;
    levelNumber.innerText = Math.floor(level);
  }

  if (level === 9.8) {
    levelLabel.innerText = "";
    levelNumber.innerText = "FINISH MOVE!";
    levelNumber.id = "finish-move";
  }

  randomiseKeys(Math.floor(level));
}

function randomiseKeys(lvl) {
  currentKeys = [];
  document.querySelector("#arrow-keys").innerHTML = "";
  currentRound++;
  for (let i = 1; i <= lvl; i++) {
    const keyCode = Math.floor(Math.random() * 4) + 37;

    const newArrowKey = document.createElement("div");
    newArrowKey.setAttribute("id", keyCode);
    newArrowKey.className = "key";
    newArrowKey.classList.add(`${currentRound}`);
    newArrowKey.innerHTML = uniCode[keyCode];

    document.querySelector("#arrow-keys").append(newArrowKey);
    currentKeys.push(newArrowKey);
  }
  window.addEventListener("keydown", spacebar);

  if (level === 9.8) {
    let chanceKey =
      document.querySelector("#arrow-keys").childNodes[
        Math.floor(Math.random() * Math.floor(level))
      ];

    chanceKey.classList.add("chance-key");
    chanceKey.innerHTML = chanceUniCode[chanceKey.id];
  }

  if (chance === "on" && level >= 6 && level < 9.8) {
    for (let i = 1; i <= 3; i++) {
      const index = Math.floor(Math.random() * Math.floor(level));
      let chanceKey = document.querySelector("#arrow-keys").childNodes[index];

      if (chanceKey.classList.contains("chance-key")) {
        i--;
      } else {
        chanceKey.classList.add("chance-key");
        chanceKey.innerHTML = chanceUniCode[chanceKey.id];
      }
    }
  }

  currentKeysHTML = document.querySelector("#arrow-keys").innerHTML;
}

function defaultMiss() {
  if (document.querySelector(".key")) {
    pressTime = currentPosition;
    grading();
  }
}

function spacebar(e) {
  if (e.keyCode === 32) {
    pressTime = currentPosition;
    grading();
    document.querySelector("#arrow-keys").innerHTML = "";
    window.removeEventListener("keydown", spacebar);
    spacebarSound();
  }
}

function startGame() {
  startTime = Date.now();
  startpos = target.getBoundingClientRect().left;

  target.classList.add("target-move");
  document.querySelector(".target-move").style.animation = `move ${
    playTime / 1000
  }s linear infinite`;

  window.requestAnimationFrame(getPosition);

  const timerID = setInterval(timer, 1000);

  document.querySelector("#progress-indicator").style.animation = `time ${
    duration / 1000
  }s linear 1 forwards`;

  function missInterval() {
    const missID = setInterval(() => {
      if (remainingTime === 0) {
        clearInterval(missID);
      }
      defaultMiss();
    }, playTime);
  }

  function levelInterval() {
    const levelID = setInterval(() => {
      if (remainingTime === 0) {
        clearInterval(levelID);
      }
      nextLevel();
    }, playTime);
  }

  setTimeout(() => {
    defaultMiss();

    missInterval();
  }, playTime * 0.9);

  setTimeout(() => {
    nextLevel();
    levelInterval();
  }, playTime * 0.901);

  randomiseKeys(1);

  function timer() {
    remainingTime = Math.max(0, remainingTime - 1000);

    let minutes = Math.floor(remainingTime / 1000 / 60);
    let seconds = 0;
    if ((remainingTime / 1000) % 60 >= 10) {
      seconds = (remainingTime / 1000) % 60;
    } else {
      seconds = `0${(remainingTime / 1000) % 60}`;
    }
    document.querySelector("#time").innerText = `${minutes}:${seconds}`;

    if (remainingTime === 0) {
      songEnd();
    }
  }

  function songEnd() {
    clearInterval(timerID);

    window.removeEventListener("keydown", spacebar);

    const gameContainer = document.querySelector("#game-container");
    gameContainer.style.animation = "fadeout 1s 1 forwards";

    const audio = document.querySelector(`#${songChosen}`);
    audio.pause();
    audio.currentTime = 0;

    displayScoreboard();

    if (score > songs[songChosen]["highScore"]) {
      songs[songChosen]["highScore"] = score;
    }

    if (
      !localStorage.getItem(`highscore.${songChosen}`) ||
      songs[songChosen]["highScore"] >
        Number(
          localStorage.getItem(`highscore.${songChosen}`).replace(/[^\d]/g, "")
        )
    ) {
      localStorage.setItem(
        `highscore.${songChosen}`,
        songs[songChosen]["highScore"].toLocaleString("en")
      );
    }

    if (document.querySelector("#chance")) {
      document.querySelector("#chance").remove();
    }

    const retry = document.querySelector("#retry");
    retry.style.display = "flex";
    retry.addEventListener("click", initialise);
  }
}

function displayScoreboard() {
  // insert table structure
  document.querySelector("#timer").insertAdjacentHTML(
    "afterend",
    `<div id="scoreboard-div">
  <table class="scoreboard">
    <tr id="header-row">
      <th>SCORE</th>
      <th>PERFECT</th>
      <th>GREAT</th>
      <th>COOL</th>
      <th>BAD</th>
      <th>MISS</th>
    </tr>
  </table>
</div>`
  );

  // insert variables
  const row = document.createElement("tr");
  row.id = "data-row";
  const scoring = document.createElement("td");
  const data = document.createElement("div");
  data.id = "data-div";
  data.innerText = score;
  document.querySelector("table").append(row);
  scoring.append(data);
  row.append(scoring);

  for (const grade in scoreboard) {
    const grading = document.createElement("td");
    const data = document.createElement("div");
    data.id = "data-div";
    data.innerText = scoreboard[grade];
    row.append(grading);
    grading.append(data);
  }
  document.querySelector("#scoreboard-div").style.animation =
    "fadein 1.5s 1 forwards";
}

function playAudio(songChosen) {
  const audio = document.querySelector(`#${songChosen}`);
  if (audio.readyState >= 2) {
    audio.play();
    setTimeout(startGame, delay);
  }
}

function songList() {
  const selectedItem = document.querySelector("select").value;
  bpm = songs[selectedItem]["bpm"];
  duration = songs[selectedItem]["duration"];
  delay = songs[selectedItem]["delay"];
  const volume = songs[selectedItem]["volume"];
  songChosen = selectedItem;

  document.querySelector(`#${songChosen}`).volume = volume;

  endTime = startTime + duration;
  remainingTime = endTime - startTime;
  playTime = (4 / bpm) * 60 * 1000;
}

function spacebarSound() {
  const sound = document.querySelector("#spacebar-sound");
  sound.volume = 0.2;
  sound.play();
}

function fullScreen(e) {
  if (e.keyCode === 70) {
    document.querySelector("body").requestFullscreen();
  }
}

function chance3(e) {
  if (e.keyCode === 46) {
    if (chance === "off") {
      chance = "on";
      const chanceButton = document.createElement("div");
      chanceButton.id = "chance";
      chanceButton.innerText = "C";
      document
        .querySelector("#game-container")
        .insertAdjacentElement("afterend", chanceButton);
    } else {
      chance = "off";
      document.querySelector("#chance").remove();
    }
  }
}

function initialise() {
  level = 1;
  score = 0;
  currentKeys = [];
  chainMultiple = -1;

  document.querySelector(".level-label").innerText = `Level `;
  document.querySelector(".level-number").innerText = Math.floor(level);
  document.querySelector(".level-number").removeAttribute("id", "finish-move");
  document.querySelector("#score").innerText = score.toLocaleString("en");
  document.querySelector("#screen-1").style.display = "flex";
  document.querySelector("#screen-2").style.display = "none";
  document.querySelector("#arrow-keys").innerHTML = "";
  document.querySelector("#retry").style.display = "none";
  document.querySelector("#screen-2").style.animation = "";
  document.querySelector("#progress-indicator").style.animation = "";
  document.querySelector("#high-score-div").remove();
  chance = "off";

  for (const grade in scoreboard) {
    scoreboard[grade] = 0;
    document.querySelector("#data-div").innerText = 0;
  }
  document.querySelector("#scoreboard-div").remove();
  document.querySelector(".target-move").style.animation = "";
  target.classList.remove("target-move");

  const gameContainer = document.querySelector("#game-container");
  gameContainer.style.animation = "";
  gameContainer.style.opacity = 1;
}

// arrow keys
window.addEventListener("keydown", (e) => {
  if (uniCode[e.keyCode]) {
    let currentKey = document.querySelector(".key");

    if (e.keyCode == currentKey.id) {
      currentKey.className = "pressed-key";
    } else {
      document.querySelector("#arrow-keys").innerHTML = currentKeysHTML;
    }
  }
});

// spacebar:
window.addEventListener("keydown", spacebar);

document.querySelector("#start-button").addEventListener("click", () => {
  document.querySelector("#screen-1").style.display = "none";
  document.querySelector("#screen-2").style.display = "flex";
  document.querySelector("#screen-2").style.animation = "fadein 1s 1";

  let minutes = Math.floor(duration / 1000 / 60);
  let seconds = 0;
  if ((duration / 1000) % 60 >= 10) {
    seconds = (duration / 1000) % 60;
  } else {
    seconds = `0${(duration / 1000) % 60}`;
  }
  document.querySelector("#time").innerText = `${minutes}:${seconds}`;

  songList();
  playAudio(songChosen);

  const highScoreDiv = document.createElement("div");
  highScoreDiv.innerText = "HIGH SCORE: ";
  highScoreDiv.id = "high-score-div";
  const highScore = document.createElement("div");
  if (localStorage.getItem(`highscore.${songChosen}`)) {
    highScore.innerText = localStorage.getItem(`highscore.${songChosen}`);
  } else {
    highScore.innerText = 0;
  }
  highScore.id = "high-score";

  highScoreDiv.append(highScore);
  document.querySelector("#game-page").prepend(highScoreDiv);
});

window.addEventListener("keydown", fullScreen);

window.addEventListener("keydown", chance3);
