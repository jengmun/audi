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

const scoring = {
  1: 1000,
  2: 1500,
  3: 2000,
  4: 2500,
  5: 3000,
  6: 5000,
  7: 6000,
  8: 7000,
  9: 8000,
  9.8: 10000,
};

const multiplier = {
  miss: 0,
  bad: 0.5,
  cool: 1,
  great: 1.5,
  perfect: 2,
  //   chain: 2 ** num,
};

const songs = {
  "beat-city": {
    bpm: 120,
    duration: 250 * 1000,
    delay: 3190,
  },

  you: {
    bpm: 136,
    duration: 250 * 1000,
    delay: 3350,
  },

  "flying-duck": {
    bpm: 156,
    duration: 240 * 1000,
    delay: 1538,
  },

  eve: {
    bpm: 185,
    duration: 219 * 1000,
    delay: 1220,
  },

  eight: {
    bpm: 120,
    duration: 167 * 1000,
    delay: 2000,
  },
};

const target = document.querySelector(".target");
const targetWidth = document.querySelector(".target").offsetWidth;
let rhythmBarWidth = document.querySelector(".rhythm-bar").clientWidth;
let bpm = 200;
let playTime = (4 / bpm) * 60 * 1000; // time taken for every 4 beats
let roundTime = playTime * 2; // time taken for each round from level 6 onwards
let level = 1;
let score = 0;
let currentKeys = [];
let grade = "";
let chainMultiple = 0;
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

function getPosition() {
  currentPosition = target.getBoundingClientRect().left + targetWidth / 2;
  window.requestAnimationFrame(getPosition);
}

function grading() {
  rhythmBarWidth = document.querySelector(".rhythm-bar").clientWidth;
  console.log("in grading");

  const perfectBeat = startpos + rhythmBarWidth * 0.75;

  const deviation = Math.abs(pressTime - perfectBeat);

  if (deviation < rhythmBarWidth * 0.02) {
    grade = "perfect";
  } else if (deviation < rhythmBarWidth * 0.05) {
    grade = "great";
  } else if (deviation < rhythmBarWidth * 0.1) {
    grade = "cool";
  } else if (deviation < rhythmBarWidth * 0.15) {
    grade = "bad";
  } else {
    grade = "miss";
  }

  if (!document.querySelector(".key")) {
  } else {
    grade = "miss";
  }

  scoreboard[grade] += 1;

  const gradeDOM = document.querySelector(".grade");
  gradeDOM.innerText = grade;
  gradeDOM.id = grade;
  gradeDOM.style.animation = `fadeoutgrade ${playTime / 2000}s 1 forwards`;
  setTimeout(function () {
    gradeDOM.style.animation = "";
    gradeDOM.style.opacity = "0";
  }, playTime / 2 + 1);

  score += multiplier[grade] * scoring[Math.floor(level)];

  document.querySelector(".score").innerText = score.toLocaleString("en");

  // setTimeout((document.querySelector(".grade").innerText = ""), playTime / 4);
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

  const levelLabel = document.querySelector("#level-label");
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

function randomiseKeys(level) {
  currentKeys = [];
  document.querySelector(".arrow-keys").innerHTML = "";
  currentRound++;
  for (let i = 1; i <= level; i++) {
    const keyCode = Math.floor(Math.random() * 4) + 37;

    const newArrowKey = document.createElement("div");
    newArrowKey.setAttribute("id", keyCode);
    newArrowKey.className = "key";
    newArrowKey.classList.add(`${currentRound}`);
    newArrowKey.innerHTML = uniCode[keyCode];

    function displayKeys() {
      document.querySelector(".arrow-keys").append(newArrowKey);
      currentKeys.push(newArrowKey);
    }

    displayKeys();

    window.addEventListener("keydown", spacebar);
  }
}

function defaultMiss() {
  if (document.querySelector(".key")) {
    console.log("in default miss");
    pressTime = currentPosition; // 0.1x after playTime ends
    console.log(pressTime);
    grading();
  }
}

function spacebar(e) {
  if (e.keyCode === 32) {
    pressTime = currentPosition;
    grading();
    document.querySelector(".arrow-keys").innerHTML = "";
    window.removeEventListener("keydown", spacebar);
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
  document.querySelector(".timer").innerText = duration / 1000;

  const missID = setInterval(defaultMiss, playTime);
  const levelID = setInterval(nextLevel, playTime);
  setTimeout(missID, playTime * 0.9);
  setTimeout(levelID, playTime * 0.9);

  randomiseKeys(1);

  function timer() {
    remainingTime = Math.max(0, remainingTime - 1000);
    document.querySelector(".timer").innerText = remainingTime / 1000;
    if (remainingTime === 0) {
      songEnd();
    }
  }

  function songEnd() {
    clearInterval(missID);
    clearInterval(levelID);
    clearInterval(timerID);

    const gameContainer = document.querySelector(".game-container");
    gameContainer.style.animation = "fadeout 1s 1 forwards";

    const audio = document.querySelector(`#${songChosen}`);
    audio.pause();
    audio.currentTime = 0;

    displayScoreboard();

    const retry = document.querySelector("#retry");
    retry.style.display = "flex";
    retry.addEventListener("click", initialise);
  }
}

function displayScoreboard() {
  // insert table structure
  document.querySelector(".timer").insertAdjacentHTML(
    "afterend",
    `<div id="scoreboard-div">
  <table class="scoreboard">
    <tr id="header-row">
      <th>Score</th>
      <th>Perfect</th>
      <th>Great</th>
      <th>Cool</th>
      <th>Bad</th>
      <th>Miss</th>
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
  songChosen = selectedItem;

  endTime = startTime + duration;
  remainingTime = endTime - startTime;
  playTime = (4 / bpm) * 60 * 1000; // time taken for every 4 beats
  // roundTime = playTime * 2; // time taken for each round from level 6 onwards
}

function initialise() {
  level = 1;
  score = 0;
  currentKeys = [];

  document.querySelector(".level-number").innerText = Math.floor(level);
  document.querySelector(".score").innerText = score.toLocaleString("en");
  document.querySelector("#screen-1").style.display = "flex";
  document.querySelector("#screen-2").style.display = "none";
  document.querySelector(".arrow-keys").innerHTML = "";
  document.querySelector("#retry").style.display = "none";

  for (const grade in scoreboard) {
    scoreboard[grade] = 0;
    document.querySelector("#data-div").innerText = 0;
  }
  document.querySelector("#scoreboard-div").remove();
  document.querySelector(".target-move").style.animation = "";
  target.classList.remove("target-move");

  const gameContainer = document.querySelector(".game-container");
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
      for (const key of currentKeys) {
        key.className = "key";
      }
    }
  }
});

// spacebar:
window.addEventListener("keydown", spacebar);

document.querySelector("#start-button").addEventListener("click", () => {
  document.querySelector("#screen-1").style.display = "none";
  document.querySelector("#screen-2").style.display = "flex";
  songList();
  playAudio(songChosen);
});

function chance() {}
